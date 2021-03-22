import ISocketConnection from './ISocketConnection';
import ISocketMessage from './ISocketMessage';

export default interface IWebSocketProvider {
  findConnections(poll_id: string): ISocketConnection[];
  sendMessage(
    connections: ISocketConnection[],
    message: string,
    data: ISocketMessage,
  ): void;
}
