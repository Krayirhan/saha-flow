package com.sahaflow.workorder.domain;

public enum WorkOrderStatus {
    OPEN("OPEN", "Is emri acildi"),
    ASSIGNED("ASSIGNED", "Personele atandi"),
    IN_PROGRESS("IN_PROGRESS", "Calisma basladi"),
    COMPLETED("COMPLETED", "Calisma tamamlandi"),
    APPROVED("APPROVED", "Musteri onayladi"),
    INVOICED("INVOICED", "Fatura kesildi"),
    PAID("PAID", "Odeme alindi"),
    CANCELLED("CANCELLED", "Iptal edildi");

    private final String code;
    private final String trLabel;

    WorkOrderStatus(String code, String trLabel) {
        this.code = code;
        this.trLabel = trLabel;
    }

    public String getCode() {
        return code;
    }

    public String getTrLabel() {
        return trLabel;
    }
}
