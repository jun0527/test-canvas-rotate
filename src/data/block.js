import { computed, reactive } from "vue";
import _ from "lodash";

export const blocks = reactive([
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
]);
export const blockDots = computed(() => {
  return _.map(blocks, (block) => {
    return {
      // t: {
      //   x: block.geo.x + block.geo.w / 2,
      //   y: block.geo.y,
      // },
      // b: {
      //   x: block.geo.x + block.geo.w / 2,
      //   y: block.geo.y + block.geo.h,
      // },
      // l: {
      //   x: block.geo.x,
      //   y: block.geo.y + block.geo.h / 2,
      // },
      // r: {
      //   x: block.geo.x + block.geo.w,
      //   y: block.geo.y + block.geo.h / 2,
      // },
      lt: {
        x: block.geo.x,
        y: block.geo.y,
      },
      lb: {
        x: block.geo.x,
        y: block.geo.y + block.geo.h,
      },
      rt: {
        x: block.geo.x + block.geo.w,
        y: block.geo.y,
      },
      rb: {
        x: block.geo.x + block.geo.w,
        y: block.geo.y + block.geo.h,
      },
    };
  });
});
export const getBlockData = (index) => {
  return blocks[index];
};
export const getBlockAttr = (index, name) => {
  return _.get(blocks[index], name);
};
export const setBlockAttr = (index, name, value) => {
  _.set(blocks[index], name, value);
  console.log(blocks[index]);
};
