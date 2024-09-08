import _ from "lodash";
import { blockDots, getBlockData } from "@/data/block";
export default function useDrawControl() {
  const drawControl = (ctx) => {
    _.forEach(blockDots.value, (dots, index) => {
      const blockData = getBlockData(index);
      _.forEach(dots, (dot) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "white";
        const centerPoint = {
          x: blockData.geo.x + blockData.geo.w / 2,
          y: blockData.geo.y + blockData.geo.h / 2,
        };
        ctx.translate(centerPoint.x, centerPoint.y);
        ctx.rotate(blockData.geo.rotate);
        ctx.translate(-centerPoint.x, -centerPoint.y);
        ctx.fillRect(dot.x - 2, dot.y - 2, 5, 5);
        ctx.strokeRect(dot.x - 2, dot.y - 2, 5, 5);
        ctx.restore();
      });
    });
  };
  return {
    drawControl,
  };
}
