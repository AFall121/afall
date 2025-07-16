# 简单记忆Flex Box布局中的要点
1.  **容器**
    1. flex容器本身display: flex;
    2. flex-direction: 确立主轴布局方向 行|列，默认为row;其余值为row-reverse, column, column-reverse
    3. flex-wrap: 设置子元素在主轴方向上是否换行,默认值为nowrap;其余值为wrap, wrap-reverse(反向换行|列)
    4. flex-flow: flex-direction flex-wrap 的简写
    5. 设置主轴用justify-content: 默认 flex-start 其余值为 flex-end,center,space-between,space-around,space-evenly
    6. 当flex-wrap为默认值nowrap时，设置辅轴用align-items,align-items 属性设置了所有直接子元素的 align-self 值作为一个组。在 Flexbox 中，它控制子元素在交叉轴上的对齐。在 Grid 布局中，它控制了子元素在其网格区域内的块向轴上的对齐。 默认值:stretch,其余常用值为flex-start,flex-end,center,baseline
    7. 当flex-wrap为wrap或wrap-reverse(即多行|列)时，需要设置多行|列的对齐方式时用align-conten!其值和align-items基本一样。只不过默认值是normal.
    8. gap-row: 行间间隔
    9. gap-column: 列间间隔
    10. gap: 行列间隔
2.  **子元素**
    1. align-self: 子元素在主轴上的对齐方式 默认值是auto采用父容器设置的对齐规则。
    2. order: 子元素在主轴上的排序方式 默认值是0
    3. flex-grow: 子元素在主轴上的扩展比例 默认值是0
    4. flex-shrink: 子元素在主轴上的收缩比例 默认值是1
    5. flex-basis: 子元素在主轴上的初始大小 默认值是auto
    6. flex: 子元素在主轴上的扩展比例、收缩比例、初始大小

总结: 采用了 flexbox 的区域就叫做 flex 容器。为了创建 flex 容器，我们把一个容器的 display 属性值改为 flex 或者 inline-flex。完成这一步之后，容器中的直系子元素就会变为 flex 元素。由于所有 CSS 属性都会有一个初始值，所以 flex 容器中的所有 flex 元素都会有下列行为：

- 元素排列为一行（flex-direction 属性的初始值是 row）。
- 元素从主轴的起始线开始。
- 元素不会在主维度方向拉伸，但是可以缩小。
- 元素被拉伸来填充交叉轴大小。
- flex-basis 属性为 auto。
- flex-wrap 属性为 nowrap。


最常用的属性 容器:display flex-flow gap justify-items align-items 子元素: flex order 
