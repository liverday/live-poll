import { container } from 'tsyringe';

import IWebSocketProvider from './models/IWebSocketProvider';
import SocketIOWebSocketProvider from './implementations/SocketIOWebSocketProvider';

container.registerInstance<IWebSocketProvider>(
  'WebSocketProvider',
  new SocketIOWebSocketProvider(),
);
