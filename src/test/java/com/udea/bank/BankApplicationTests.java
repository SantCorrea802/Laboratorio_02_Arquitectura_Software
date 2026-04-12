package com.udea.bank;

import com.udea.bank.DTO.CustomerDTO;
import com.udea.bank.DTO.TransactionDTO;
import com.udea.bank.controller.CustomerController;
import com.udea.bank.controller.TransactionController;
import com.udea.bank.entity.Customer;
import com.udea.bank.entity.Transaction;
import com.udea.bank.mapper.CustomerMapper;
import com.udea.bank.repository.CustomerRepository;
import com.udea.bank.repository.TransactionRepository;
import com.udea.bank.service.CustomerService;
import com.udea.bank.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BankApplicationTests {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerMapper customerMapper;

    @Mock
    private TransactionService transactionService;

    @Mock
    private CustomerService customerService;

    @InjectMocks
    private TransactionService testedTransactionService;

    @InjectMocks
    private CustomerService testedCustomerService;

    @Nested
    class TransactionServiceTests {

        @Test
        void transferMoney_ok() {
            TransactionDTO request = txDto(null, "ACC-001", "ACC-002", 100.0);
            Customer sender = customer(1L, "ACC-001", "Ana", "Lopez", 500.0);
            Customer receiver = customer(2L, "ACC-002", "Juan", "Perez", 200.0);

            when(customerRepository.findByAccountNumber("ACC-001")).thenReturn(Optional.of(sender));
            when(customerRepository.findByAccountNumber("ACC-002")).thenReturn(Optional.of(receiver));
            when(customerRepository.save(any(Customer.class))).thenAnswer(i -> i.getArgument(0));
            when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> {
                Transaction tx = i.getArgument(0);
                tx.setId(99L);
                return tx;
            });

            TransactionDTO result = testedTransactionService.transferMoney(request);

            assertThat(result.getId()).isEqualTo(99L);
            assertThat(sender.getBalance()).isEqualTo(400.0);
            assertThat(receiver.getBalance()).isEqualTo(300.0);
        }

        @Test
        void transferMoney_error_whenInvalidInput() {
            TransactionDTO request = txDto(null, null, "ACC-002", 100.0);

            IllegalArgumentException ex = assertThrows(
                    IllegalArgumentException.class,
                    () -> testedTransactionService.transferMoney(request)
            );

            assertThat(ex.getMessage()).contains("cannot be null");
        }

        @Test
        void transferMoney_error_whenInsufficientBalance() {
            TransactionDTO request = txDto(null, "ACC-001", "ACC-002", 700.0);
            Customer sender = customer(1L, "ACC-001", "Ana", "Lopez", 500.0);
            Customer receiver = customer(2L, "ACC-002", "Juan", "Perez", 200.0);

            when(customerRepository.findByAccountNumber("ACC-001")).thenReturn(Optional.of(sender));
            when(customerRepository.findByAccountNumber("ACC-002")).thenReturn(Optional.of(receiver));

            IllegalArgumentException ex = assertThrows(
                    IllegalArgumentException.class,
                    () -> testedTransactionService.transferMoney(request)
            );

            assertThat(ex.getMessage()).isEqualTo("Sender Balance not enough");
        }

        @Test
        void getTransactionsForAccount_ok() {
            Transaction tx = transaction(1L, "ACC-001", "ACC-002", 150.0);
            when(transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber("ACC-001", "ACC-001"))
                    .thenReturn(List.of(tx));

            List<TransactionDTO> result = testedTransactionService.getTransactionsForAccount("ACC-001");

            assertThat(result).hasSize(1);
            assertThat(result.getFirst().getId()).isEqualTo(1L);
        }

        @Test
        void getTransactionById_ok() {
            when(transactionRepository.findById(7L)).thenReturn(Optional.of(transaction(7L, "A", "B", 25.0)));

            TransactionDTO result = testedTransactionService.getTransactionById(7L);

            assertThat(result.getId()).isEqualTo(7L);
        }

        @Test
        void getTransactionById_error_whenNotFound() {
            when(transactionRepository.findById(7L)).thenReturn(Optional.empty());

            IllegalArgumentException ex = assertThrows(
                    IllegalArgumentException.class,
                    () -> testedTransactionService.getTransactionById(7L)
            );

            assertThat(ex.getMessage()).isEqualTo("Transaction not found");
        }

        @Test
        void createTransaction_ok() {
            when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> {
                Transaction tx = i.getArgument(0);
                tx.setId(15L);
                return tx;
            });

            TransactionDTO result = testedTransactionService.createTransaction(txDto(null, "A", "B", 80.0));

            assertThat(result.getId()).isEqualTo(15L);
        }

        @Test
        void getAllTransactions_ok() {
            when(transactionRepository.findAll()).thenReturn(List.of(transaction(22L, "A", "B", 10.0)));

            List<TransactionDTO> result = testedTransactionService.getAllTransactions();

            assertThat(result).hasSize(1);
            assertThat(result.getFirst().getId()).isEqualTo(22L);
        }

        @Test
        void updateTransaction_ok() {
            Transaction existing = transaction(30L, "OLD1", "OLD2", 15.0);
            when(transactionRepository.findById(30L)).thenReturn(Optional.of(existing));
            when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArgument(0));

            TransactionDTO result = testedTransactionService.updateTransaction(30L, txDto(null, "NEW1", "NEW2", 45.0));

            assertThat(result.getSenderAccountNumber()).isEqualTo("NEW1");
            assertThat(result.getAmount()).isEqualTo(45.0);
        }

        @Test
        void updateTransaction_error_whenNotFound() {
            when(transactionRepository.findById(30L)).thenReturn(Optional.empty());

            IllegalArgumentException ex = assertThrows(
                    IllegalArgumentException.class,
                    () -> testedTransactionService.updateTransaction(30L, new TransactionDTO())
            );

            assertThat(ex.getMessage()).isEqualTo("Transaction not found");
        }

        @Test
        void deleteTransaction_ok() {
            Transaction tx = transaction(40L, "A", "B", 10.0);
            when(transactionRepository.findById(40L)).thenReturn(Optional.of(tx));

            testedTransactionService.deleteTransaction(40L);

            verify(transactionRepository).delete(tx);
        }

        @Test
        void deleteTransaction_error_whenNotFound() {
            when(transactionRepository.findById(40L)).thenReturn(Optional.empty());

            IllegalArgumentException ex = assertThrows(
                    IllegalArgumentException.class,
                    () -> testedTransactionService.deleteTransaction(40L)
            );

            assertThat(ex.getMessage()).isEqualTo("Transaction not found");
        }
    }

    @Nested
    class CustomerServiceTests {

        @Test
        void getAllCustomer_ok() {
            Customer customer = customer(1L, "ACC-001", "Ana", "Lopez", 1000.0);
            CustomerDTO dto = customerDto(1L, "Ana", "Lopez", "ACC-001", 1000.0);

            when(customerRepository.findAll()).thenReturn(List.of(customer));
            when(customerMapper.toDTO(customer)).thenReturn(dto);

            List<CustomerDTO> result = testedCustomerService.getAllCustomer();

            assertThat(result).hasSize(1);
            assertThat(result.getFirst().getAccountNumber()).isEqualTo("ACC-001");
        }

        @Test
        void getCustomerById_ok_and_notFound() {
            Customer customer = customer(2L, "ACC-002", "Juan", "Perez", 800.0);
            CustomerDTO dto = customerDto(2L, "Juan", "Perez", "ACC-002", 800.0);

            when(customerRepository.findById(2L)).thenReturn(Optional.of(customer));
            when(customerMapper.toDTO(customer)).thenReturn(dto);
            when(customerRepository.findById(99L)).thenReturn(Optional.empty());

            CustomerDTO result = testedCustomerService.getCustomerById(2L);
            assertThat(result.getId()).isEqualTo(2L);

            RuntimeException ex = assertThrows(RuntimeException.class, () -> testedCustomerService.getCustomerById(99L));
            assertThat(ex.getMessage()).isEqualTo("Cliente no encontrado");
        }

        @Test
        void createCustomer_ok() {
            CustomerDTO input = customerDto(null, "Maria", "Gomez", "ACC-300", 2500.0);
            Customer entity = customer(null, "ACC-300", "Maria", "Gomez", 2500.0);
            Customer saved = customer(10L, "ACC-300", "Maria", "Gomez", 2500.0);
            CustomerDTO output = customerDto(10L, "Maria", "Gomez", "ACC-300", 2500.0);

            when(customerMapper.toEntity(input)).thenReturn(entity);
            when(customerRepository.save(entity)).thenReturn(saved);
            when(customerMapper.toDTO(saved)).thenReturn(output);

            CustomerDTO result = testedCustomerService.createCustomer(input);

            assertThat(result.getId()).isEqualTo(10L);
        }
    }

    @Nested
    class TransactionControllerTests {

        private TransactionController controller;

        @BeforeEach
        void init() {
            controller = new TransactionController();
            ReflectionTestUtils.setField(controller, "transactionService", transactionService);
        }

        @Test
        void transferMoney_returns200_and400() {
            when(transactionService.transferMoney(any(TransactionDTO.class))).thenReturn(new TransactionDTO());
            ResponseEntity<?> ok = controller.transferMoney(new TransactionDTO());
            assertThat(ok.getStatusCode().is2xxSuccessful()).isTrue();

            when(transactionService.transferMoney(any(TransactionDTO.class)))
                    .thenThrow(new IllegalArgumentException("Sender Balance not enough"));
            ResponseEntity<?> bad = controller.transferMoney(new TransactionDTO());
            assertThat(bad.getStatusCode().is4xxClientError()).isTrue();
        }

        @Test
        void getTransactionById_returns200_and400() {
            TransactionDTO dto = new TransactionDTO();
            dto.setId(12L);
            when(transactionService.getTransactionById(12L)).thenReturn(dto);
            ResponseEntity<?> ok = controller.getTransactionById(12L);
            assertThat(ok.getStatusCode().is2xxSuccessful()).isTrue();
            assertThat(ok.getBody()).isInstanceOf(TransactionDTO.class);

            when(transactionService.getTransactionById(99L)).thenThrow(new IllegalArgumentException("Transaction not found"));
            ResponseEntity<?> bad = controller.getTransactionById(99L);
            assertThat(bad.getStatusCode().is4xxClientError()).isTrue();
        }

        @Test
        void listEndpoints_ok() {
            when(transactionService.getTransactionsForAccount("ACC-001")).thenReturn(List.of(new TransactionDTO()));
            when(transactionService.getAllTransactions()).thenReturn(List.of(new TransactionDTO()));

            assertThat(controller.getTransactionsByAccount("ACC-001")).hasSize(1);
            assertThat(controller.getAllTransactions()).hasSize(1);
        }

        @Test
        void updateTransaction_returns200_and400() {
            when(transactionService.updateTransaction(any(Long.class), any(TransactionDTO.class))).thenReturn(new TransactionDTO());
            ResponseEntity<?> ok = controller.updateTransaction(9L, new TransactionDTO());
            assertThat(ok.getStatusCode().is2xxSuccessful()).isTrue();

            when(transactionService.updateTransaction(any(Long.class), any(TransactionDTO.class)))
                    .thenThrow(new IllegalArgumentException("Transaction not found"));
            ResponseEntity<?> bad = controller.updateTransaction(9L, new TransactionDTO());
            assertThat(bad.getStatusCode().is4xxClientError()).isTrue();
        }

        @Test
        void deleteTransaction_returns200_and400() {
            ResponseEntity<?> ok = controller.deleteTransaction(3L);
            assertThat(ok.getStatusCode().is2xxSuccessful()).isTrue();

            doThrow(new IllegalArgumentException("Transaction not found"))
                    .when(transactionService).deleteTransaction(4L);
            ResponseEntity<?> bad = controller.deleteTransaction(4L);
            assertThat(bad.getStatusCode().is4xxClientError()).isTrue();
        }
    }

    @Nested
    class CustomerControllerTests {

        private CustomerController controller;

        @BeforeEach
        void init() {
            controller = new CustomerController(customerService);
        }

        @Test
        void getEndpoints_ok() {
            CustomerDTO dto = customerDto(1L, "Ana", "Lopez", "ACC-001", 1000.0);
            when(customerService.getAllCustomer()).thenReturn(List.of(dto));
            when(customerService.getCustomerById(1L)).thenReturn(dto);

            assertThat(controller.getAllCustomers().getStatusCode().is2xxSuccessful()).isTrue();
            assertThat(controller.getCustomerById(1L).getStatusCode().is2xxSuccessful()).isTrue();
        }

        @Test
        void createCustomer_ok_and_balanceNull() {
            CustomerDTO input = customerDto(null, "Ana", "Lopez", "ACC-010", 1500.0);
            CustomerDTO created = customerDto(3L, "Ana", "Lopez", "ACC-010", 1500.0);
            when(customerService.createCustomer(any(CustomerDTO.class))).thenReturn(created);

            ResponseEntity<CustomerDTO> ok = controller.createCustomer(input);
            assertThat(ok.getStatusCode().is2xxSuccessful()).isTrue();

            CustomerDTO invalid = customerDto(null, "Ana", "Lopez", "ACC-010", null);
            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> controller.createCustomer(invalid));
            assertThat(ex.getMessage()).isEqualTo("Balance cannot be null");
        }
    }

    private Customer customer(Long id, String account, String firstName, String lastName, Double balance) {
        return new Customer(id, account, firstName, lastName, balance);
    }

    private CustomerDTO customerDto(Long id, String firstName, String lastName, String account, Double balance) {
        return new CustomerDTO(id, firstName, lastName, account, balance);
    }

    private Transaction transaction(Long id, String sender, String receiver, Double amount) {
        Transaction tx = new Transaction();
        tx.setId(id);
        tx.setSenderAccountNumber(sender);
        tx.setReceiverAccountNumber(receiver);
        tx.setAmount(amount);
        return tx;
    }

    private TransactionDTO txDto(Long id, String sender, String receiver, Double amount) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(id);
        dto.setSenderAccountNumber(sender);
        dto.setReceiverAccountNumber(receiver);
        dto.setAmount(amount);
        return dto;
    }
}
