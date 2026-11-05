export class CalendlyEventDto {
  uri: string;
  status: string;
  created_at: string;
  updated_at: string;
  event: string;
  scheduled_event: string;
  invitee: string;
  old_invitee?: string;
  old_event?: string;
  old_scheduled_event?: string;
  cancellation?: {
    canceled_by: string;
    reason: string;
  };
}

export class CalendlyInviteeDto {
  uri: string;
  event: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  status: string;
  scheduled_event: string;
  payment?: {
    external_id: string;
    provider: string;
    amount: number;
    currency: string;
    terms: string;
  };
}
