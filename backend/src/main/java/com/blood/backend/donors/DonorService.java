package com.blood.backend.donors;

import com.blood.backend.common.BloodGroup;
import com.blood.backend.common.Role;
import com.blood.backend.donors.dto.DonorProfileDto;
import com.blood.backend.donors.dto.UpsertDonorProfileRequest;
import com.blood.backend.security.SecurityUtils;
import com.blood.backend.users.User;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DonorService {
    private final DonorProfileRepository donorProfileRepository;

    public DonorService(DonorProfileRepository donorProfileRepository) {
        this.donorProfileRepository = donorProfileRepository;
    }

    @Transactional
    public DonorProfileDto upsertMyProfile(UpsertDonorProfileRequest req) {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.DONOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can manage donor profile");
        }

        DonorProfile profile = donorProfileRepository.findByUserId(me.getId()).orElseGet(() -> {
            DonorProfile dp = new DonorProfile();
            dp.setUser(me);
            return dp;
        });

        profile.setBloodGroup(req.bloodGroup());
        profile.setLocation(req.location().trim());
        profile.setPhone(req.phone().trim());
        if (req.availability() != null) {
            profile.setAvailability(req.availability());
        } else if (profile.getId() == null) {
            profile.setAvailability(true);
        }

        DonorProfile saved = donorProfileRepository.save(profile);
        return toDto(saved);
    }

    public DonorProfileDto getMyProfile() {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.DONOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can view donor profile");
        }
        DonorProfile profile = donorProfileRepository.findByUserId(me.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor profile not found"));
        return toDto(profile);
    }

    public List<DonorProfileDto> search(BloodGroup bloodGroup, String location) {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.RECEIVER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only receivers can search donors");
        }
        return donorProfileRepository.search(bloodGroup, location, true).stream().map(this::toDto).toList();
    }

    public DonorProfileDto toDto(DonorProfile dp) {
        return new DonorProfileDto(
                dp.getId(),
                dp.getUser().getId(),
                dp.getUser().getName(),
                dp.getBloodGroup(),
                dp.getLocation(),
                dp.getPhone(),
                dp.isAvailability(),
                dp.getLastDonationDate()
        );
    }
}

