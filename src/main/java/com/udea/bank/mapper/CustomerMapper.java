package com.udea.bank.mapper;

// Aca haremos mapeo de entity a DTO y de DTO a entity


import com.udea.bank.DTO.CustomerDTO;
import com.udea.bank.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);
    CustomerDTO toDTO(Customer customer);
    Customer toEntity(CustomerDTO customerDTO);
}
