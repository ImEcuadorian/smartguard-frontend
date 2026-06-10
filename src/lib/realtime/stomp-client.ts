import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";

export type RealtimeSubscription = {
  topic: string;
  onMessage: (message: IMessage) => void;
};

export function createRealtimeClient(
  accessToken: string,
  subscriptions: RealtimeSubscription[],
) {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws";
  const activeSubscriptions: StompSubscription[] = [];

  const client = new Client({
    brokerURL: `${wsUrl}?access_token=${encodeURIComponent(accessToken)}`,
    reconnectDelay: 5000,
    onConnect: () => {
      subscriptions.forEach((subscription) => {
        activeSubscriptions.push(
          client.subscribe(subscription.topic, subscription.onMessage),
        );
      });
    },
    onStompError: (frame) => {
      console.error("STOMP error", frame.headers.message ?? frame.body);
    },
  });

  client.activate();

  return () => {
    activeSubscriptions.forEach((subscription) => subscription.unsubscribe());
    void client.deactivate();
  };
}
