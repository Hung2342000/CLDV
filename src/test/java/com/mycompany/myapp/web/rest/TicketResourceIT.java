package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Ticket;
import com.mycompany.myapp.repository.TicketRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TicketResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TicketResourceIT {

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_SERVICE_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_SERVICE_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED_TIME = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_TIME = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CHANGE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CHANGE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_SHOP_CODE = "AAAAAAAAAA";
    private static final String UPDATED_SHOP_CODE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CLOSED_TIME = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CLOSED_TIME = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_SMS_RECEIVED = "AAAAAAAAAA";
    private static final String UPDATED_SMS_RECEIVED = "BBBBBBBBBB";

    private static final String DEFAULT_PROVINCE = "AAAAAAAAAA";
    private static final String UPDATED_PROVINCE = "BBBBBBBBBB";

    private static final String DEFAULT_SMS_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_SMS_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_CALLING_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_CALLING_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tickets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTicketMockMvc;

    private Ticket ticket;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ticket createEntity(EntityManager em) {
        Ticket ticket = new Ticket()
            .phone(DEFAULT_PHONE)
            .serviceType(DEFAULT_SERVICE_TYPE)
            .status(DEFAULT_STATUS)
            .createdTime(DEFAULT_CREATED_TIME)
            .changeBy(DEFAULT_CHANGE_BY)
            .shopCode(DEFAULT_SHOP_CODE)
            .closedTime(DEFAULT_CLOSED_TIME)
            .smsReceived(DEFAULT_SMS_RECEIVED)
            .province(DEFAULT_PROVINCE)
            .smsStatus(DEFAULT_SMS_STATUS)
            .callingStatus(DEFAULT_CALLING_STATUS)
            .note(DEFAULT_NOTE);
        return ticket;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ticket createUpdatedEntity(EntityManager em) {
        Ticket ticket = new Ticket()
            .phone(UPDATED_PHONE)
            .serviceType(UPDATED_SERVICE_TYPE)
            .status(UPDATED_STATUS)
            .createdTime(UPDATED_CREATED_TIME)
            .changeBy(UPDATED_CHANGE_BY)
            .shopCode(UPDATED_SHOP_CODE)
            .closedTime(UPDATED_CLOSED_TIME)
            .smsReceived(UPDATED_SMS_RECEIVED)
            .province(UPDATED_PROVINCE)
            .smsStatus(UPDATED_SMS_STATUS)
            .callingStatus(UPDATED_CALLING_STATUS)
            .note(UPDATED_NOTE);
        return ticket;
    }

    @BeforeEach
    public void initTest() {
        ticket = createEntity(em);
    }

    @Test
    @Transactional
    void createTicket() throws Exception {
        int databaseSizeBeforeCreate = ticketRepository.findAll().size();
        // Create the Ticket
        restTicketMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ticket)))
            .andExpect(status().isCreated());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeCreate + 1);
        Ticket testTicket = ticketList.get(ticketList.size() - 1);
        assertThat(testTicket.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testTicket.getServiceType()).isEqualTo(DEFAULT_SERVICE_TYPE);
        assertThat(testTicket.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testTicket.getCreatedTime()).isEqualTo(DEFAULT_CREATED_TIME);
        assertThat(testTicket.getChangeBy()).isEqualTo(DEFAULT_CHANGE_BY);
        assertThat(testTicket.getShopCode()).isEqualTo(DEFAULT_SHOP_CODE);
        assertThat(testTicket.getClosedTime()).isEqualTo(DEFAULT_CLOSED_TIME);
        assertThat(testTicket.getSmsReceived()).isEqualTo(DEFAULT_SMS_RECEIVED);
        assertThat(testTicket.getProvince()).isEqualTo(DEFAULT_PROVINCE);
        assertThat(testTicket.getSmsStatus()).isEqualTo(DEFAULT_SMS_STATUS);
        assertThat(testTicket.getCallingStatus()).isEqualTo(DEFAULT_CALLING_STATUS);
        assertThat(testTicket.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void createTicketWithExistingId() throws Exception {
        // Create the Ticket with an existing ID
        ticket.setId(1L);

        int databaseSizeBeforeCreate = ticketRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTicketMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ticket)))
            .andExpect(status().isBadRequest());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTickets() throws Exception {
        // Initialize the database
        ticketRepository.saveAndFlush(ticket);

        // Get all the ticketList
        restTicketMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ticket.getId().intValue())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].serviceType").value(hasItem(DEFAULT_SERVICE_TYPE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdTime").value(hasItem(DEFAULT_CREATED_TIME.toString())))
            .andExpect(jsonPath("$.[*].changeBy").value(hasItem(DEFAULT_CHANGE_BY)))
            .andExpect(jsonPath("$.[*].shopCode").value(hasItem(DEFAULT_SHOP_CODE)))
            .andExpect(jsonPath("$.[*].closedTime").value(hasItem(DEFAULT_CLOSED_TIME.toString())))
            .andExpect(jsonPath("$.[*].smsReceived").value(hasItem(DEFAULT_SMS_RECEIVED)))
            .andExpect(jsonPath("$.[*].province").value(hasItem(DEFAULT_PROVINCE)))
            .andExpect(jsonPath("$.[*].smsStatus").value(hasItem(DEFAULT_SMS_STATUS)))
            .andExpect(jsonPath("$.[*].callingStatus").value(hasItem(DEFAULT_CALLING_STATUS)))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }

    @Test
    @Transactional
    void getTicket() throws Exception {
        // Initialize the database
        ticketRepository.saveAndFlush(ticket);

        // Get the ticket
        restTicketMockMvc
            .perform(get(ENTITY_API_URL_ID, ticket.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ticket.getId().intValue()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.serviceType").value(DEFAULT_SERVICE_TYPE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdTime").value(DEFAULT_CREATED_TIME.toString()))
            .andExpect(jsonPath("$.changeBy").value(DEFAULT_CHANGE_BY))
            .andExpect(jsonPath("$.shopCode").value(DEFAULT_SHOP_CODE))
            .andExpect(jsonPath("$.closedTime").value(DEFAULT_CLOSED_TIME.toString()))
            .andExpect(jsonPath("$.smsReceived").value(DEFAULT_SMS_RECEIVED))
            .andExpect(jsonPath("$.province").value(DEFAULT_PROVINCE))
            .andExpect(jsonPath("$.smsStatus").value(DEFAULT_SMS_STATUS))
            .andExpect(jsonPath("$.callingStatus").value(DEFAULT_CALLING_STATUS))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE));
    }

    @Test
    @Transactional
    void getNonExistingTicket() throws Exception {
        // Get the ticket
        restTicketMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTicket() throws Exception {
        // Initialize the database
        ticketRepository.saveAndFlush(ticket);

        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();

        // Update the ticket
        Ticket updatedTicket = ticketRepository.findById(ticket.getId()).get();
        // Disconnect from session so that the updates on updatedTicket are not directly saved in db
        em.detach(updatedTicket);
        updatedTicket
            .phone(UPDATED_PHONE)
            .serviceType(UPDATED_SERVICE_TYPE)
            .status(UPDATED_STATUS)
            .createdTime(UPDATED_CREATED_TIME)
            .changeBy(UPDATED_CHANGE_BY)
            .shopCode(UPDATED_SHOP_CODE)
            .closedTime(UPDATED_CLOSED_TIME)
            .smsReceived(UPDATED_SMS_RECEIVED)
            .province(UPDATED_PROVINCE)
            .smsStatus(UPDATED_SMS_STATUS)
            .callingStatus(UPDATED_CALLING_STATUS)
            .note(UPDATED_NOTE);

        restTicketMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTicket.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTicket))
            )
            .andExpect(status().isOk());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
        Ticket testTicket = ticketList.get(ticketList.size() - 1);
        assertThat(testTicket.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testTicket.getServiceType()).isEqualTo(UPDATED_SERVICE_TYPE);
        assertThat(testTicket.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTicket.getCreatedTime()).isEqualTo(UPDATED_CREATED_TIME);
        assertThat(testTicket.getChangeBy()).isEqualTo(UPDATED_CHANGE_BY);
        assertThat(testTicket.getShopCode()).isEqualTo(UPDATED_SHOP_CODE);
        assertThat(testTicket.getClosedTime()).isEqualTo(UPDATED_CLOSED_TIME);
        assertThat(testTicket.getSmsReceived()).isEqualTo(UPDATED_SMS_RECEIVED);
        assertThat(testTicket.getProvince()).isEqualTo(UPDATED_PROVINCE);
        assertThat(testTicket.getSmsStatus()).isEqualTo(UPDATED_SMS_STATUS);
        assertThat(testTicket.getCallingStatus()).isEqualTo(UPDATED_CALLING_STATUS);
        assertThat(testTicket.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void putNonExistingTicket() throws Exception {
        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();
        ticket.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ticket.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ticket))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTicket() throws Exception {
        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();
        ticket.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ticket))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTicket() throws Exception {
        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();
        ticket.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ticket)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTicketWithPatch() throws Exception {
        // Initialize the database
        ticketRepository.saveAndFlush(ticket);

        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();

        // Update the ticket using partial update
        Ticket partialUpdatedTicket = new Ticket();
        partialUpdatedTicket.setId(ticket.getId());

        partialUpdatedTicket
            .status(UPDATED_STATUS)
            .smsReceived(UPDATED_SMS_RECEIVED)
            .province(UPDATED_PROVINCE)
            .smsStatus(UPDATED_SMS_STATUS)
            .callingStatus(UPDATED_CALLING_STATUS);

        restTicketMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicket.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTicket))
            )
            .andExpect(status().isOk());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
        Ticket testTicket = ticketList.get(ticketList.size() - 1);
        assertThat(testTicket.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testTicket.getServiceType()).isEqualTo(DEFAULT_SERVICE_TYPE);
        assertThat(testTicket.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTicket.getCreatedTime()).isEqualTo(DEFAULT_CREATED_TIME);
        assertThat(testTicket.getChangeBy()).isEqualTo(DEFAULT_CHANGE_BY);
        assertThat(testTicket.getShopCode()).isEqualTo(DEFAULT_SHOP_CODE);
        assertThat(testTicket.getClosedTime()).isEqualTo(DEFAULT_CLOSED_TIME);
        assertThat(testTicket.getSmsReceived()).isEqualTo(UPDATED_SMS_RECEIVED);
        assertThat(testTicket.getProvince()).isEqualTo(UPDATED_PROVINCE);
        assertThat(testTicket.getSmsStatus()).isEqualTo(UPDATED_SMS_STATUS);
        assertThat(testTicket.getCallingStatus()).isEqualTo(UPDATED_CALLING_STATUS);
        assertThat(testTicket.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void fullUpdateTicketWithPatch() throws Exception {
        // Initialize the database
        ticketRepository.saveAndFlush(ticket);

        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();

        // Update the ticket using partial update
        Ticket partialUpdatedTicket = new Ticket();
        partialUpdatedTicket.setId(ticket.getId());

        partialUpdatedTicket
            .phone(UPDATED_PHONE)
            .serviceType(UPDATED_SERVICE_TYPE)
            .status(UPDATED_STATUS)
            .createdTime(UPDATED_CREATED_TIME)
            .changeBy(UPDATED_CHANGE_BY)
            .shopCode(UPDATED_SHOP_CODE)
            .closedTime(UPDATED_CLOSED_TIME)
            .smsReceived(UPDATED_SMS_RECEIVED)
            .province(UPDATED_PROVINCE)
            .smsStatus(UPDATED_SMS_STATUS)
            .callingStatus(UPDATED_CALLING_STATUS)
            .note(UPDATED_NOTE);

        restTicketMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicket.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTicket))
            )
            .andExpect(status().isOk());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
        Ticket testTicket = ticketList.get(ticketList.size() - 1);
        assertThat(testTicket.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testTicket.getServiceType()).isEqualTo(UPDATED_SERVICE_TYPE);
        assertThat(testTicket.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTicket.getCreatedTime()).isEqualTo(UPDATED_CREATED_TIME);
        assertThat(testTicket.getChangeBy()).isEqualTo(UPDATED_CHANGE_BY);
        assertThat(testTicket.getShopCode()).isEqualTo(UPDATED_SHOP_CODE);
        assertThat(testTicket.getClosedTime()).isEqualTo(UPDATED_CLOSED_TIME);
        assertThat(testTicket.getSmsReceived()).isEqualTo(UPDATED_SMS_RECEIVED);
        assertThat(testTicket.getProvince()).isEqualTo(UPDATED_PROVINCE);
        assertThat(testTicket.getSmsStatus()).isEqualTo(UPDATED_SMS_STATUS);
        assertThat(testTicket.getCallingStatus()).isEqualTo(UPDATED_CALLING_STATUS);
        assertThat(testTicket.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void patchNonExistingTicket() throws Exception {
        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();
        ticket.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ticket.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ticket))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTicket() throws Exception {
        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();
        ticket.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ticket))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTicket() throws Exception {
        int databaseSizeBeforeUpdate = ticketRepository.findAll().size();
        ticket.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ticket)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ticket in the database
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTicket() throws Exception {
        // Initialize the database
        ticketRepository.saveAndFlush(ticket);

        int databaseSizeBeforeDelete = ticketRepository.findAll().size();

        // Delete the ticket
        restTicketMockMvc
            .perform(delete(ENTITY_API_URL_ID, ticket.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ticket> ticketList = ticketRepository.findAll();
        assertThat(ticketList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
