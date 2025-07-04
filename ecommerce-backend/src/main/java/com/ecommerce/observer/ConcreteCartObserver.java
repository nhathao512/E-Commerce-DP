package com.ecommerce.observer;

import org.springframework.messaging.simp.SimpMessagingTemplate;

public class ConcreteCartObserver implements CartObserver {
    private final String observerName;
    private final String userId;
    private final SimpMessagingTemplate messagingTemplate;

    public ConcreteCartObserver(String observerName, String userId, SimpMessagingTemplate messagingTemplate) {
        this.observerName = observerName;
        this.userId = userId;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void update(int itemCount) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/topic/cart",
                new CartUpdateMessage(itemCount)
        );
    }

    public static class CartUpdateMessage {
        private final int itemCount;

        public CartUpdateMessage(int itemCount) {
            this.itemCount = itemCount;
        }

        public int getItemCount() {
            return itemCount;
        }
    }
}