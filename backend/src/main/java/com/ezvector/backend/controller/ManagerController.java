package com.ezvector.backend.controller;

import com.ezvector.backend.dto.ManagerResponse;
import com.ezvector.backend.dto.UpgradeToManagerRequest;
import com.ezvector.backend.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/managers")
@CrossOrigin(origins = "http://localhost:5173")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @PostMapping("/upgrade")
    public ResponseEntity<ManagerResponse> upgradeToManager(@RequestBody UpgradeToManagerRequest request) {
        ManagerResponse response = managerService.upgradeCustomerToManager(request);
        
        if (response.getManagerId() == null) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/supabase/{supabaseUserId}")
    public ResponseEntity<ManagerResponse> getManagerBySupabaseId(@PathVariable String supabaseUserId) {
        ManagerResponse response = managerService.getManagerBySupabaseId(supabaseUserId);
        
        if (response.getManagerId() == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{supabaseUserId}")
    public ResponseEntity<Boolean> isManager(@PathVariable String supabaseUserId) {
        boolean isManager = managerService.isManager(supabaseUserId);
        return ResponseEntity.ok(isManager);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Manager endpoint is working!");
    }
}
