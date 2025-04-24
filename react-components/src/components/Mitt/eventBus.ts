// src/eventBus.ts
import mitt from 'mitt';
// 定义事件类型（可选但推荐）
type Events = {
  customMessage: string;
};
const emitter = mitt<Events>();
export default emitter;
