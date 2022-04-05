import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import ISocketConnection from '../models/ISocketConnection';
import ISocketMessage from '../models/ISocketMessage';
import IWebSocketProvider from '../models/IWebSocketProvider';

class SocketIOWebSocketProvider implements IWebSocketProvider {
  private io: Server;

  private connections: ISocketConnection[] = [];

  constructor() {
    const PORT = process.env.SOCKET_PORT || '3334';
    const httpServer = createServer();
    this.io = new Server(httpServer);

    httpServer.listen(PORT);

    this.io.on('connection', (socket: Socket) => {
      const { poll_id } = socket.handshake.query;
      
      this.connections.push({
        socket_id: socket.id,
        poll_id: String(poll_id),
      });

      socket.on('disconnect', () => {
        const socketIndex = this.connections.findIndex(
          connection => connection.socket_id === socket.id,
        );

        if (socketIndex >= 0) {
          this.connections.splice(socketIndex, 1);
        }
      });
    });
  }

  public findConnections(poll_id: string): ISocketConnection[] {
    return this.connections.filter(
      connection => connection.poll_id === poll_id,
    );
  }

  public sendMessage(
    connections: ISocketConnection[],
    message: string,
    data: ISocketMessage,
  ): void {
    connections.forEach(connection => {
      this.io.to(connection.socket_id).emit(message, data);
    });
  }
}

export default SocketIOWebSocketProvider;
