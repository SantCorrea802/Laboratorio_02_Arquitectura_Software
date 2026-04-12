package com.udea.bank.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

//POJO --> Plain old java object



@Data
@Entity
@Table(name="transaction") // Nombre de la tabla en la base de datos
                            // Y parte del mapeo con la base de datos
public class Transaction { // nombre de la tabla pero en el codigo
    @Id //Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Autogenerado
    private Long id; // nombre de la primary key

    // nombre de la columna en la base de datos y el nombre del atributo en el codigo
    // nullable = false indica que los datos seran obligatorios
    @Column(name="sender_account_number", nullable = false)
    private String senderAccountNumber;

    @Column(name="receiver_account_number", nullable = false)
    private String receiverAccountNumber;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable=false)
    private LocalDateTime timestamp;

}
