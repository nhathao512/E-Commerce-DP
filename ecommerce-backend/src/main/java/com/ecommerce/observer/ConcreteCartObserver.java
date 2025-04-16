package com.ecommerce.observer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class ConcreteCartObserver implements CartObserver {
    private static final Logger logger = LoggerFactory.getLogger(ConcreteCartObserver.class);
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
        logger.info("Observer {}: Cart updated for user {} with {} items", observerName, userId, itemCount);
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