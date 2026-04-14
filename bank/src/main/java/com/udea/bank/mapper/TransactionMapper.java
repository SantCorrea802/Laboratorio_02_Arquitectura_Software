package com.udea.bank.mapper;

import com.udea.bank.DTO.TransactionDTO;
import com.udea.bank.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
@Mapper
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);
    TransactionDTO toDTO(Transaction transaction);

}
