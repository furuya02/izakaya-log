export default interface AgentEvent {
    AWSAccountId: string,
    AWSContactTraceRecordFormatVersion: string,
    Agent:{
        ARN: string,
        AfterContactWorkDuration: number,
        AfterContactWorkEndTimestamp: string,
        AfterContactWorkStartTimestamp: string,
        AgentInteractionDuration: number,
        ConnectedToAgentTimestamp: string,
        CustomerHoldDuration: number,
        HierarchyGroups: string|null,
        LongestHoldDuration: number,
        NumberOfHolds: number,
        RoutingProfile: {
        ARN: string,
        Name: string
        },
        Username: string
    },
    AgentConnectionAttempts: number,
    Attributes: {},
    Channel: "VOICE",
    ConnectedToSystemTimestamp: string,
    ContactId: string,
    CustomerEndpoint: {
        Address: string,
        Type: "TELEPHONE_NUMBER"
    },
    DisconnectTimestamp: string,
    InitialContactId: string|null,
    InitiationMethod: "INBOUND" | "OUTBOUND" | "TRANSFER" | "CALLBACK" | "API" | "QUEUE_TRANSFER"
    InitiationTimestamp: string,
    InstanceARN: string,
    LastUpdateTimestamp: string,
    MediaStreams: [
        {
        Type: "AUDIO"
        }
    ],
    NextContactId: string|null,
    PreviousContactId: string|null,
    Queue: {
        ARN: string,
        DequeueTimestamp: string|null,
        Duration: number,
        EnqueueTimestamp: string|null,
        Name: string
    },
    Recording :string|null,
    Recordings: string|null,
    SystemEndpoint: {
        Address: string,
        Type: "TELEPHONE_NUMBER"
    },
    TransferCompletedTimestamp: string|null,
    TransferredToEndpoint: string|null
}
  