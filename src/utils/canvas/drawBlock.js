import _ from "lodash";
import { blocks } from "@/data/block";
export default function useDrawBlock() {
  const drawBlock = (ctx) => {
    _.forEach(blocks, (block) => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = block.fill;
      const centerPoint = {
        x: block.geo.x + block.geo.w / 2,
        y: block.geo.y + block.geo.h / 2,
      };
      ctx.translate(centerPoint.x, centerPoint.y);
      ctx.rotate(block.geo.rotate);
      ctx.translate(-centerPoint.x, -centerPoint.y);
      ctx.fillRect(block.geo.x, block.geo.y, block.geo.w, block.geo.h);
      ctx.restore();
    });
  };
  return {
    drawBlock,
  };
}
