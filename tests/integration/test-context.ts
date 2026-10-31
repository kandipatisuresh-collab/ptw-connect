export interface TestContext { baseUrl: string; actorHeaders: Record<string, string>; }
export const requesterContext: TestContext = { baseUrl: 'http://localhost:3000', actorHeaders: { 'x-ptw-user': 'test-requester', 'x-ptw-role': 'Permit Requester', 'x-ptw-plant': 'plant-1', 'x-ptw-area': 'area-1' } };
