package com.ptwconnect.api;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class IdentityAndMasterDataController {

    private final IdentityAndMasterDataService service;

    public IdentityAndMasterDataController(IdentityAndMasterDataService service) {
        this.service = service;
    }

    @GetMapping("/users/me")
    public IdentityAndMasterDataService.UserProfile user(Authentication authentication) {
        return service.userProfile(authentication.getName());
    }

    @GetMapping("/users/me/authorizations")
    public List<IdentityAndMasterDataService.AuthorizationView> authorizations(Authentication authentication) {
        return service.authorizations(authentication.getName());
    }

    @GetMapping("/master-data/plants")
    public List<IdentityAndMasterDataService.PlantView> plants(Authentication authentication) {
        return service.plants(authentication.getName());
    }

    @GetMapping("/master-data/permit-types")
    public List<IdentityAndMasterDataService.PermitTypeView> permitTypes(
            Authentication authentication,
            @RequestParam(required = false) UUID plantId) {
        return service.permitTypes(authentication.getName(), plantId);
    }

    @GetMapping("/master-data/hazards")
    public List<IdentityAndMasterDataService.MasterDataView> hazards(
            Authentication authentication,
            @RequestParam(required = false) UUID plantId) {
        return service.hazards(authentication.getName(), plantId);
    }

    @GetMapping("/master-data/controls")
    public List<IdentityAndMasterDataService.MasterDataView> controls(
            Authentication authentication,
            @RequestParam(required = false) UUID plantId) {
        return service.controls(authentication.getName(), plantId);
    }
}
