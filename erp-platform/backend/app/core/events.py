import os
import aio_pika
import json
from typing import Any, Dict
from app.core.logging.logger import get_logger

logger = get_logger(__name__)

class EventBus:
    """
    Enterprise EventBus utilizing RabbitMQ for asynchronous event-driven architecture.
    
    This class handles the connection to RabbitMQ via aio_pika, declares the core topic
    exchange for the ERP system, and provides a persistent, robust publishing mechanism.
    
    Attributes:
        connection: The aio_pika connection object.
        channel: The AMQP channel.
        exchange: The AMQP topic exchange.
        amqp_url: The connection URL for RabbitMQ.
        exchange_name: The default exchange name (`erp.topic.exchange`).
    """
    def __init__(self):
        self.connection = None
        self.channel = None
        self.exchange = None
        self.amqp_url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
        self.exchange_name = "erp.topic.exchange"

    async def initialize(self):
        """
        Initializes the RabbitMQ connection, channel, and declares the durable exchange.
        Must be called during the application startup lifecycle.
        """
        try:
            self.connection = await aio_pika.connect_robust(self.amqp_url)
            self.channel = await self.connection.channel()
            self.exchange = await self.channel.declare_exchange(
                self.exchange_name, aio_pika.ExchangeType.TOPIC, durable=True
            )
            logger.info("RabbitMQ EventBus initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize RabbitMQ EventBus: {e}")

    async def publish(self, routing_key: str, message: Dict[str, Any]):
        if not self.exchange:
            logger.warning("EventBus not initialized. Cannot publish message.")
            return

        message_body = json.dumps(message).encode()
        pika_message = aio_pika.Message(
            body=message_body,
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT
        )
        
        await self.exchange.publish(
            pika_message,
            routing_key=routing_key
        )
        logger.debug(f"Event published: {routing_key}")

    async def close(self):
        if self.connection:
            await self.connection.close()
            logger.info("RabbitMQ EventBus connection closed.")

event_bus = EventBus()
