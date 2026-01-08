import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind3, // 默认预设，支持 Tailwind/Windi CSS 语法
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind3, // 默认预设，支持 Tailwind/Windi CSS 语法
    presetAttributify(), // 支持属性化模式，如 <div flex="~ col">
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerDirectives(), // 支持 @apply 等指令
  ],
})
