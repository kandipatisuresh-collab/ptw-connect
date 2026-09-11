package com.ptwconnect.api;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class IdentityAndMasterDataService {

    private final JdbcTemplate jdbcTemplate;

    public IdentityAndMasterDataService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public UserProfile userProfile(String externalSubject) {
        try {
            UserProfile profile = jdbcTemplate.queryForObject(
                    """
                    SELECT BIN_TO_UUID(id), external_subject, display_name, email, active
                    FROM users
                    WHERE external_subject = ? AND active = TRUE
                    """,
                    (resultSet, rowNum) -> new UserProfile(
                            UUID.fromString(resultSet.getString(1)),
                            resultSet.getString(2),
                            resultSet.getString(3),
                            resultSet.getString(4),
                            resultSet.getBoolean(5),
                            List.of()),
                    externalSubject);
            if (profile == null) {
                throw denied();
            }
            List<String> roles = jdbcTemplate.queryForList(
                    """
                    SELECT r.code
                    FROM roles r
                    JOIN user_roles ur ON ur.role_id = r.id
                    JOIN users u ON u.id = ur.user_id
                    WHERE u.external_subject = ? AND u.active = TRUE AND r.active = TRUE
                    ORDER BY r.code
                    """,
                    String.class,
                    externalSubject);
            return new UserProfile(profile.id(), profile.externalSubject(), profile.displayName(),
                    profile.email(), profile.active(), roles);
        } catch (EmptyResultDataAccessException exception) {
            throw denied();
        }
    }

    public List<AuthorizationView> authorizations(String externalSubject) {
        UUID userId = userId(externalSubject);
        return jdbcTemplate.query(
                """
                SELECT BIN_TO_UUID(ua.id), BIN_TO_UUID(p.id), p.code, p.name,
                       BIN_TO_UUID(fl.id), fl.code, ua.valid_from, ua.valid_to
                FROM user_authorizations ua
                JOIN plants p ON p.id = ua.plant_id
                LEFT JOIN functional_locations fl ON fl.id = ua.functional_location_id
                WHERE ua.user_id = UUID_TO_BIN(?) AND ua.active = TRUE
                  AND p.active = TRUE
                  AND ua.valid_from <= CURRENT_DATE
                  AND (ua.valid_to IS NULL OR ua.valid_to >= CURRENT_DATE)
                ORDER BY p.code, fl.code
                """,
                (resultSet, rowNum) -> new AuthorizationView(
                        UUID.fromString(resultSet.getString(1)),
                        UUID.fromString(resultSet.getString(2)),
                        resultSet.getString(3),
                        resultSet.getString(4),
                        resultSet.getString(5) == null ? null : UUID.fromString(resultSet.getString(5)),
                        resultSet.getString(6),
                        resultSet.getObject(7, LocalDate.class),
                        resultSet.getObject(8, LocalDate.class)),
                userId.toString());
    }

    public List<PlantView> plants(String externalSubject) {
        UUID userId = userId(externalSubject);
        return jdbcTemplate.query(
                """
                SELECT DISTINCT BIN_TO_UUID(p.id), p.code, p.name, p.timezone
                FROM user_authorizations ua
                JOIN plants p ON p.id = ua.plant_id
                WHERE ua.user_id = UUID_TO_BIN(?) AND ua.active = TRUE AND p.active = TRUE
                  AND ua.valid_from <= CURRENT_DATE
                  AND (ua.valid_to IS NULL OR ua.valid_to >= CURRENT_DATE)
                ORDER BY p.code
                """,
                (resultSet, rowNum) -> new PlantView(
                        UUID.fromString(resultSet.getString(1)),
                        resultSet.getString(2),
                        resultSet.getString(3),
                        resultSet.getString(4)),
                userId.toString());
    }

    public List<PermitTypeView> permitTypes(String externalSubject, UUID requestedPlantId) {
        UUID userId = userId(externalSubject);
        ensurePlantAuthorized(userId, requestedPlantId);
        StringBuilder sql = new StringBuilder("""
                SELECT DISTINCT BIN_TO_UUID(pt.id), BIN_TO_UUID(p.id), p.code, pt.code, pt.name
                FROM permit_types pt
                JOIN plants p ON p.id = pt.plant_id
                JOIN user_authorizations ua ON ua.plant_id = pt.plant_id
                WHERE ua.user_id = UUID_TO_BIN(?) AND ua.active = TRUE AND p.active = TRUE AND pt.active = TRUE
                  AND ua.valid_from <= CURRENT_DATE
                  AND (ua.valid_to IS NULL OR ua.valid_to >= CURRENT_DATE)
                """);
        if (requestedPlantId != null) {
            sql.append(" AND p.id = ?");
        }
        sql.append(" ORDER BY p.code, pt.code");
        if (requestedPlantId == null) {
            return jdbcTemplate.query(sql.toString(), this::permitType, userId.toString());
        }
        return jdbcTemplate.query(sql.toString(), this::permitType, userId.toString(), requestedPlantId.toString());
    }

    public List<MasterDataView> hazards(String externalSubject, UUID requestedPlantId) {
        return scopedMasterData(externalSubject, requestedPlantId, "hazards");
    }

    public List<MasterDataView> controls(String externalSubject, UUID requestedPlantId) {
        return scopedMasterData(externalSubject, requestedPlantId, "controls");
    }

    private List<MasterDataView> scopedMasterData(String externalSubject, UUID requestedPlantId, String table) {
        UUID userId = userId(externalSubject);
        ensurePlantAuthorized(userId, requestedPlantId);
        String plantFilter = requestedPlantId == null ? "" : " AND (m.plant_id IS NULL OR m.plant_id = ? )";
        String sql = """
                SELECT DISTINCT BIN_TO_UUID(m.id), m.code, m.name, m.plant_id IS NULL,
                       COALESCE(p.code, 'GLOBAL')
                FROM %s m
                LEFT JOIN plants p ON p.id = m.plant_id
                JOIN user_authorizations ua ON (ua.plant_id = m.plant_id OR m.plant_id IS NULL)
                WHERE ua.user_id = UUID_TO_BIN(?) AND ua.active = TRUE AND m.active = TRUE
                  AND ua.valid_from <= CURRENT_DATE
                  AND (ua.valid_to IS NULL OR ua.valid_to >= CURRENT_DATE)
                %s
                ORDER BY m.code
                """.formatted(table, plantFilter);
        if (requestedPlantId == null) {
            return jdbcTemplate.query(sql, this::masterData, userId.toString());
        }
        return jdbcTemplate.query(sql, this::masterData, userId.toString(), requestedPlantId.toString());
    }

    private void ensurePlantAuthorized(UUID userId, UUID requestedPlantId) {
        if (requestedPlantId == null) {
            return;
        }
        Integer matches = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM user_authorizations
                WHERE user_id = UUID_TO_BIN(?) AND plant_id = UUID_TO_BIN(?)
                  AND active = TRUE
                  AND valid_from <= CURRENT_DATE
                  AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
                """,
                Integer.class,
                userId.toString(),
                requestedPlantId.toString());
        if (matches == null || matches == 0) {
            throw denied();
        }
    }

    private PermitTypeView permitType(java.sql.ResultSet resultSet, int rowNum) throws java.sql.SQLException {
        return new PermitTypeView(
                UUID.fromString(resultSet.getString(1)),
                UUID.fromString(resultSet.getString(2)),
                resultSet.getString(3),
                resultSet.getString(4),
                resultSet.getString(5));
    }

    private MasterDataView masterData(java.sql.ResultSet resultSet, int rowNum) throws java.sql.SQLException {
        return new MasterDataView(
                UUID.fromString(resultSet.getString(1)),
                resultSet.getString(2),
                resultSet.getString(3),
                resultSet.getBoolean(4),
                resultSet.getString(5));
    }

    private UUID userId(String externalSubject) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM users WHERE external_subject = ? AND active = TRUE",
                    (resultSet, rowNum) -> UUID.fromString(toUuidString(resultSet.getBytes(1))),
                    externalSubject);
        } catch (EmptyResultDataAccessException exception) {
            throw denied();
        }
    }

    private static String toUuidString(byte[] value) {
        if (value == null || value.length != 16) {
            throw new IllegalStateException("Invalid user identifier");
        }
        long mostSignificantBits = 0;
        long leastSignificantBits = 0;
        for (int index = 0; index < 8; index++) {
            mostSignificantBits = (mostSignificantBits << 8) | (value[index] & 0xffL);
            leastSignificantBits = (leastSignificantBits << 8) | (value[index + 8] & 0xffL);
        }
        return new UUID(mostSignificantBits, leastSignificantBits).toString();
    }

    private AccessDeniedException denied() {
        return new AccessDeniedException("Active PTW identity or authorization was not found");
    }

    public record UserProfile(UUID id, String externalSubject, String displayName, String email,
                              boolean active, List<String> roles) { }

    public record AuthorizationView(UUID id, UUID plantId, String plantCode, String plantName,
                                    UUID functionalLocationId, String functionalLocationCode,
                                    LocalDate validFrom, LocalDate validTo) { }

    public record PlantView(UUID id, String code, String name, String timezone) { }

    public record PermitTypeView(UUID id, UUID plantId, String plantCode, String code, String name) { }

    public record MasterDataView(UUID id, String code, String name, boolean global, String plantCode) { }
}
