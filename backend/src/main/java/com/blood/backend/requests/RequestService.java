package com.blood.backend.requests;

import com.blood.backend.common.RequestStatus;
import com.blood.backend.common.Role;
import com.blood.backend.donors.DonorProfile;
import com.blood.backend.donors.DonorProfileRepository;
import com.blood.backend.requests.dto.CreateRequest;
import com.blood.backend.requests.dto.RequestDto;
import com.blood.backend.security.SecurityUtils;
import com.blood.backend.users.User;
import com.blood.backend.users.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
public class RequestService {
    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository;
    private final DonorProfileRepository donorProfileRepository;

    public RequestService(
            BloodRequestRepository bloodRequestRepository,
            UserRepository userRepository,
            DonorProfileRepository donorProfileRepository
    ) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.userRepository = userRepository;
        this.donorProfileRepository = donorProfileRepository;
    }

    @Transactional
    public RequestDto create(CreateRequest req) {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.RECEIVER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only receivers can create requests");
        }

        User donor = userRepository.findById(req.donorUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));
        if (donor.getRole() != Role.DONOR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected user is not a donor");
        }

        DonorProfile donorProfile = donorProfileRepository.findByUserId(donor.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Donor profile not set"));
        if (!donorProfile.isAvailability()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Donor not available");
        }

        if (bloodRequestRepository.existsByReceiverIdAndDonorIdAndStatus(me.getId(), donor.getId(), RequestStatus.PENDING)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have a pending request for this donor");
        }

        BloodRequest br = new BloodRequest();
        br.setReceiver(me);
        br.setDonor(donor);
        br.setStatus(RequestStatus.PENDING);
        br.setNote(req.note());
        BloodRequest saved = bloodRequestRepository.save(br);
        return toDto(saved);
    }

    public List<RequestDto> incomingForDonor() {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.DONOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can view incoming requests");
        }
        return bloodRequestRepository.findByDonorIdOrderByRequestedAtDesc(me.getId()).stream().map(this::toDto).toList();
    }

    public List<RequestDto> outgoingForReceiver() {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.RECEIVER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only receivers can view outgoing requests");
        }
        return bloodRequestRepository.findByReceiverIdOrderByRequestedAtDesc(me.getId()).stream().map(this::toDto).toList();
    }

    @Transactional
    public RequestDto accept(Long requestId) {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.DONOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can accept requests");
        }
        BloodRequest br = bloodRequestRepository.findByIdAndDonorId(requestId, me.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (br.getStatus() != RequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request is not pending");
        }
        br.setStatus(RequestStatus.ACCEPTED);
        br.setRespondedAt(Instant.now());
        return toDto(bloodRequestRepository.save(br));
    }

    @Transactional
    public RequestDto reject(Long requestId) {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.DONOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can reject requests");
        }
        BloodRequest br = bloodRequestRepository.findByIdAndDonorId(requestId, me.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (br.getStatus() != RequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request is not pending");
        }
        br.setStatus(RequestStatus.REJECTED);
        br.setRespondedAt(Instant.now());
        return toDto(bloodRequestRepository.save(br));
    }

    @Transactional
    public RequestDto complete(Long requestId) {
        User me = SecurityUtils.requireUser().getUser();
        if (me.getRole() != Role.DONOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can complete donations");
        }

        BloodRequest br = bloodRequestRepository.findByIdAndDonorId(requestId, me.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (br.getStatus() != RequestStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only accepted requests can be completed");
        }

        br.setStatus(RequestStatus.COMPLETED);
        br.setCompletedAt(Instant.now());
        bloodRequestRepository.save(br);

        DonorProfile donorProfile = donorProfileRepository.findByUserId(me.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Donor profile not set"));
        donorProfile.setAvailability(false);
        donorProfile.setLastDonationDate(LocalDate.now());
        donorProfileRepository.save(donorProfile);

        return toDto(br);
    }

    private RequestDto toDto(BloodRequest br) {
        return new RequestDto(
                br.getId(),
                br.getReceiver().getId(),
                br.getReceiver().getName(),
                br.getDonor().getId(),
                br.getDonor().getName(),
                br.getStatus(),
                br.getRequestedAt(),
                br.getRespondedAt(),
                br.getCompletedAt(),
                br.getNote()
        );
    }
}

