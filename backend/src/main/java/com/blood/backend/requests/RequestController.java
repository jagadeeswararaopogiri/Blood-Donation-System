package com.blood.backend.requests;

import com.blood.backend.requests.dto.CreateRequest;
import com.blood.backend.requests.dto.RequestDto;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {
    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PreAuthorize("hasRole('RECEIVER')")
    @PostMapping
    public RequestDto create(@Valid @RequestBody CreateRequest req) {
        return requestService.create(req);
    }

    @PreAuthorize("hasRole('DONOR')")
    @GetMapping("/incoming")
    public List<RequestDto> incoming() {
        return requestService.incomingForDonor();
    }

    @PreAuthorize("hasRole('RECEIVER')")
    @GetMapping("/outgoing")
    public List<RequestDto> outgoing() {
        return requestService.outgoingForReceiver();
    }

    @PreAuthorize("hasRole('DONOR')")
    @PatchMapping("/{id}/accept")
    public RequestDto accept(@PathVariable("id") Long id) {
        return requestService.accept(id);
    }

    @PreAuthorize("hasRole('DONOR')")
    @PatchMapping("/{id}/reject")
    public RequestDto reject(@PathVariable("id") Long id) {
        return requestService.reject(id);
    }

    @PreAuthorize("hasRole('DONOR')")
    @PatchMapping("/{id}/complete")
    public RequestDto complete(@PathVariable("id") Long id) {
        return requestService.complete(id);
    }
}

