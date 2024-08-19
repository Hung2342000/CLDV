package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Ticket.
 */
@Entity
@Table(name = "ticket")
public class Ticket implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "phone")
    private String phone;

    @Column(name = "service_type")
    private String serviceType;

    @Column(name = "status")
    private String status;

    @Column(name = "created_time")
    private LocalDate createdTime;

    @Column(name = "change_by")
    private String changeBy;

    @Column(name = "shop_code")
    private String shopCode;

    @Column(name = "closed_time")
    private LocalDate closedTime;

    @Column(name = "sms_received")
    private String smsReceived;

    @Column(name = "province")
    private String province;

    @Column(name = "sms_status")
    private String smsStatus;

    @Column(name = "calling_status")
    private String callingStatus;

    @Column(name = "note")
    private String note;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ticket id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return this.phone;
    }

    public Ticket phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getServiceType() {
        return this.serviceType;
    }

    public Ticket serviceType(String serviceType) {
        this.setServiceType(serviceType);
        return this;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getStatus() {
        return this.status;
    }

    public Ticket status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getCreatedTime() {
        return this.createdTime;
    }

    public Ticket createdTime(LocalDate createdTime) {
        this.setCreatedTime(createdTime);
        return this;
    }

    public void setCreatedTime(LocalDate createdTime) {
        this.createdTime = createdTime;
    }

    public String getChangeBy() {
        return this.changeBy;
    }

    public Ticket changeBy(String changeBy) {
        this.setChangeBy(changeBy);
        return this;
    }

    public void setChangeBy(String changeBy) {
        this.changeBy = changeBy;
    }

    public String getShopCode() {
        return this.shopCode;
    }

    public Ticket shopCode(String shopCode) {
        this.setShopCode(shopCode);
        return this;
    }

    public void setShopCode(String shopCode) {
        this.shopCode = shopCode;
    }

    public LocalDate getClosedTime() {
        return this.closedTime;
    }

    public Ticket closedTime(LocalDate closedTime) {
        this.setClosedTime(closedTime);
        return this;
    }

    public void setClosedTime(LocalDate closedTime) {
        this.closedTime = closedTime;
    }

    public String getSmsReceived() {
        return this.smsReceived;
    }

    public Ticket smsReceived(String smsReceived) {
        this.setSmsReceived(smsReceived);
        return this;
    }

    public void setSmsReceived(String smsReceived) {
        this.smsReceived = smsReceived;
    }

    public String getProvince() {
        return this.province;
    }

    public Ticket province(String province) {
        this.setProvince(province);
        return this;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getSmsStatus() {
        return this.smsStatus;
    }

    public Ticket smsStatus(String smsStatus) {
        this.setSmsStatus(smsStatus);
        return this;
    }

    public void setSmsStatus(String smsStatus) {
        this.smsStatus = smsStatus;
    }

    public String getCallingStatus() {
        return this.callingStatus;
    }

    public Ticket callingStatus(String callingStatus) {
        this.setCallingStatus(callingStatus);
        return this;
    }

    public void setCallingStatus(String callingStatus) {
        this.callingStatus = callingStatus;
    }

    public String getNote() {
        return this.note;
    }

    public Ticket note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ticket)) {
            return false;
        }
        return id != null && id.equals(((Ticket) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ticket{" +
            "id=" + getId() +
            ", phone='" + getPhone() + "'" +
            ", serviceType='" + getServiceType() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdTime='" + getCreatedTime() + "'" +
            ", changeBy='" + getChangeBy() + "'" +
            ", shopCode='" + getShopCode() + "'" +
            ", closedTime='" + getClosedTime() + "'" +
            ", smsReceived='" + getSmsReceived() + "'" +
            ", province='" + getProvince() + "'" +
            ", smsStatus='" + getSmsStatus() + "'" +
            ", callingStatus='" + getCallingStatus() + "'" +
            ", note='" + getNote() + "'" +
            "}";
    }
}
