package com.roadrescue.dto;

public class AdminStats {
    private long total;
    private long pending;
    private long approved;
    private long rejected;
    private long active;
    private long completed;
    private long cancelled;

    public AdminStats() {}

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public long getPending() { return pending; }
    public void setPending(long pending) { this.pending = pending; }

    public long getApproved() { return approved; }
    public void setApproved(long approved) { this.approved = approved; }

    public long getRejected() { return rejected; }
    public void setRejected(long rejected) { this.rejected = rejected; }

    public long getActive() { return active; }
    public void setActive(long active) { this.active = active; }

    public long getCompleted() { return completed; }
    public void setCompleted(long completed) { this.completed = completed; }

    public long getCancelled() { return cancelled; }
    public void setCancelled(long cancelled) { this.cancelled = cancelled; }
}
