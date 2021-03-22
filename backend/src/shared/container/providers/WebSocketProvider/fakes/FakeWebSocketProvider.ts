import ISocketConnection from '../models/ISocketConnection';
import ISocketMessage from '../models/ISocketMessage';
import IWebSocketProvider from '../models/IWebSocketProvider';

class FakeWebSocketProvider implements IWebSocketProvider {
  findConnections(poll_id: string): ISocketConnection[] {
    return [];
  }

  sendMessage(
    connections: ISocketConnection[],
    message: string,
    data: ISocketMessage,
  ): void {
    console.log(connections, message, data);
  }
}

export default FakeWebSocketProvider;
