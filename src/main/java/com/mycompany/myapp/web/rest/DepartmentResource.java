package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Department;
import com.mycompany.myapp.repository.DepartmentRepository;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Transactional
public class DepartmentResource {

    private final DepartmentRepository departmentRepository;

    public DepartmentResource(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/department/all")
    public ResponseEntity<List<Department>> getAllDeparment() throws URISyntaxException {
        List<Department> list = departmentRepository
            .findAll()
            .stream()
            .filter(item -> !item.getCode().equals("CT4"))
            .collect(Collectors.toList());
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/department/all/province")
    public ResponseEntity<List<Department>> getAllDeparmentProvince() throws URISyntaxException {
        List<Department> list = departmentRepository
            .findAll()
            .stream()
            .filter(item -> !item.getProvince().equals("Văn phòng công ty"))
            .collect(Collectors.toList());
        return ResponseEntity.ok().body(list);
    }
}
