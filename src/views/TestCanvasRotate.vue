<script setup>
import { onMounted, ref, watch } from "vue";
import _ from "lodash";

const ctx = ref(null);
const blocks = [
  {
    id: 1,
    fill: "#0080FF",
    geo: {
      x: 100,
      y: 100,
      w: 50,
      h: 100,
      rotate: 0,
    },
  },
  {
    id: 2,
    fill: "#01B468",
    geo: {
      x: 300,
      y: 300,
      w: 50,
      h: 100,
      rotate: 45,
    },
  },
  // {
  //   fill: "#FFA04222",
  //   geo: {
  //     x: 300,
  //     y: 300,
  //     w: 50,
  //     h: 100,
  //     rotate: 0,
  //   },
  // },
];
const editor = ref(null);
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
const draw = () => {
  ctx.value.save();
  drawBlock(ctx.value);
  ctx.value.restore();
  requestAnimationFrame(draw);
};
// const init = () => {
//   if (ctx.value) {
//     requestAnimationFrame(draw);
//   }
// }
const hoverBlock = ref(null);
const isHoverBlock = (pos, block) => {
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

  return posX >= x && posX <= x + w && posY >= y && posY <= y + h;
  // return pos.x >= x && pos.x <= x + w && pos.y >= y && pos.y <= y + h;
};
const handleMousemove = (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  hoverBlock.value = null;
  _.forEach(blocks, (block) => {
    if (isHoverBlock({ x, y }, block)) {
      hoverBlock.value = block.id;
    }
  });
};
watch(ctx, () => {
  if (ctx.value) {
    console.log(ctx.value);
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
    <canvas
      ref="editor"
      :width="600"
      :height="600"
      :class="['border border-[1px]', 'mx-auto']"
      @mousemove="handleMousemove"
    ></canvas>
  </div>
</template>
