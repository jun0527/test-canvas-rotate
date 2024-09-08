<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import _ from "lodash";
import useDrawBlock from "../utils/canvas/drawBlock";
import useDrawControl from "../utils/canvas/control";
import { blockDots, blocks, getBlockData, setBlockAttr } from "@/data/block";

const ctx = ref(null);
const editor = ref(null);
const { drawBlock } = useDrawBlock();
const { drawControl } = useDrawControl();
const draw = () => {
  ctx.value.save();
  ctx.value.fillStyle = "white";
  ctx.value.fillRect(0, 0, 600, 600);
  drawBlock(ctx.value);
  drawControl(ctx.value);
  ctx.value.restore();
  requestAnimationFrame(draw);
};
// const init = () => {
//   if (ctx.value) {
//     requestAnimationFrame(draw);
//   }
// };
const hoverBlock = ref(null);
const hoverDot = reactive({
  index: null,
  name: null,
});
const pressDot = ref(null);
const isHoverBlock = (pos, block, dot = null) => {
  // const { x, y, w, h } = block.geo;
  const { x, y, w, h, rotate } = block.geo;
  const center = {
    x: block.geo.x + block.geo.w / 2,
    y: block.geo.y + block.geo.h / 2,
  };
  const posX =
    center.x +
    (pos.x - center.x) * Math.cos(-rotate) -
    (pos.y - center.y) * Math.sin(-rotate);
  const posY =
    center.y +
    (pos.x - center.x) * Math.sin(-rotate) +
    (pos.y - center.y) * Math.cos(-rotate);
  // console.log("%c old", "color: pink", block.id, pos.x, pos.y);
  // console.log("%c new", "color: lime", block.id, posX, posY);
  if (dot) {
    return (
      posX >= dot.x - 2 &&
      posX <= dot.x + 3 &&
      posY >= dot.y - 2 &&
      posY <= dot.y + 3
    );
  }
  return posX >= x && posX <= x + w && posY >= y && posY <= y + h;
  // return pos.x >= x && pos.x <= x + w && pos.y >= y && pos.y <= y + h;
};
const isPressDot = ref(false);
const lastPos = ref(null);
const getRotatePoint = (pos, center, rotate) => {
  console.log("pos", pos);
  console.log("center", center);

  const posX =
    center.x +
    (pos.x - center.x) * Math.cos(rotate) -
    (pos.y - center.y) * Math.sin(rotate);
  const posY =
    center.y +
    (pos.x - center.x) * Math.sin(rotate) +
    (pos.y - center.y) * Math.cos(rotate);
  return {
    x: posX,
    y: posY,
  };
};
const handleMousemove = (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  hoverBlock.value = null;
  if (!isPressDot.value) {
    hoverDot.index = null;
    hoverDot.name = null;
  }
  _.forEach(blocks, (block) => {
    if (isHoverBlock({ x, y }, block)) {
      hoverBlock.value = block.id;
    }
  });
  _.forEach(blockDots.value, (dots, index) => {
    const block = getBlockData(index);
    _.forEach(dots, (dot, key) => {
      if (isHoverBlock({ x, y }, block, dot)) {
        hoverDot.index = index;
        hoverDot.name = key;
      }
    });
  });
  // 拖曳改block大小
  if (isPressDot.value && pressDot.value) {
    console.log(e.offsetX, e.offsetY);
    const pos = {
      x: e.offsetX,
      y: e.offsetY,
    };
    const offset = {
      x: pos.x - lastPos.value.x,
      y: pos.y - lastPos.value.y,
    };
    lastPos.value = pos;
    console.log(pressDot.value);

    const block = getBlockData(pressDot.value.index);
    const { x, y, w, h, rotate } = block.geo;
    const center = {
      x: block.geo.x + block.geo.w / 2,
      y: block.geo.y + block.geo.h / 2,
    };
    const lt = getRotatePoint({ x, y }, center, rotate);
    const rt = getRotatePoint({ x: x + w, y }, center, rotate);
    const lb = getRotatePoint({ x, y: y + h }, center, rotate);
    const rb = getRotatePoint({ x: x + w, y: y + h }, center, rotate);
    const rotateDot = _.map(blockDots.value[pressDot.value.index], (dot) => {
      return getRotatePoint(dot, center, rotate);
    });
    console.log("blockDots.value", blockDots.value);
    console.log("rotateDot", rotateDot);

    console.log("lt", lt);
    console.log("rt", rt);
    console.log("lb", lb);
    console.log("rb", rb);

    if (pressDot.value.name === "lt") {
      // const newGeo = {
      //   x: block.geo.x + offset.x,
      //   y: block.geo.y + offset.y,
      //   w: block.geo.w - offset.x,
      //   h: block.geo.h - offset.y,
      //   rotate: block.geo.rotate,
      // };
      const newLt = { x: lt.x + offset.x, y: lt.y + offset.y };
      const newW = Math.sqrt((newLt.x - rt.x) ** 2 + (newLt.y - rt.y) ** 2);
      const newH = Math.sqrt((newLt.x - lb.x) ** 2 + (newLt.y - lb.y) ** 2);
      console.log("newLt", newLt);
      console.log("newLt", newLt);

      const newCenter = {
        x: newLt.x + (rb.x - newLt.x) / 2,
        y: newLt.y + (rb.y - newLt.y) / 2,
      };
      const unRotateLt = getRotatePoint(newLt, newCenter, -rotate);
      const newGeo = {
        x: unRotateLt.x,
        y: unRotateLt.y,
        w: newW,
        h: newH,
        rotate,
      };
      console.log(newGeo);

      setBlockAttr(pressDot.value.index, "geo", newGeo);
    }

    // const pos = {
    //   x: e.c
    // }
  }
};
const handleMousedown = (e) => {
  const pos = {
    x: e.offsetX,
    y: e.offsetY,
  };
  if (hoverDot.name) {
    pressDot.value = hoverDot;
    console.log(pressDot.value);

    isPressDot.value = true;
    lastPos.value = pos;
  }
};
const handleMouseup = () => {
  if (isPressDot.value) {
    isPressDot.value = false;
  }
  lastPos.value = null;
  pressDot.value = null;
};
watch(pressDot, () => {
  console.log("pressDot.value", pressDot.value);
});
watch(ctx, () => {
  if (ctx.value) {
    requestAnimationFrame(draw);
  }
});
onMounted(() => {
  ctx.value = editor.value.getContext("2d");
  // draw(ctx);
  // init();
});
</script>
<template>
  <div :class="['py-[60px]']">
    <h2 :class="['text-[20px] text-center']">TestCanvasRotate</h2>
    <p :class="['text-[16px] text-center']">
      hoverBlock: {{ hoverBlock ? hoverBlock : "null" }}
    </p>
    <p :class="['text-[16px] text-center']">
      hoverDot: {{ hoverDot ? hoverDot : "null" }}
    </p>
    <canvas
      ref="editor"
      :width="600"
      :height="600"
      :class="['border border-[1px]', 'mx-auto']"
      @mousemove="handleMousemove"
      @mousedown="handleMousedown"
      @mouseup="handleMouseup"
    ></canvas>
  </div>
</template>
