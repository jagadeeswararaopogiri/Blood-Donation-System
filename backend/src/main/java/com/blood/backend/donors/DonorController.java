package com.blood.backend.donors;

import com.blood.backend.common.BloodGroup;
import com.blood.backend.donors.dto.DonorProfileDto;
import com.blood.backend.donors.dto.UpsertDonorProfileRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DonorController {
    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PreAuthorize("hasRole('DONOR')")
    @GetMapping("/donors/me")
    public DonorProfileDto myProfile() {
        return donorService.getMyProfile();
    }

    @PreAuthorize("hasRole('DONOR')")
    @PutMapping("/donors/me")
    public DonorProfileDto upsertMyProfile(@Valid @RequestBody UpsertDonorProfileRequest req) {
        return donorService.upsertMyProfile(req);
    }

    @PreAuthorize("hasRole('RECEIVER')")
    @GetMapping("/donors")
    public List<DonorProfileDto> search(
            @RequestParam(required = false) BloodGroup bloodGroup,
            @RequestParam(required = false) String location
    ) {
        return donorService.search(bloodGroup, location);
    }
}

