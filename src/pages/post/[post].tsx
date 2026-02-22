import { withNavFooterStaticProps } from '../../lib/blog/withNavFooterStaticProps'
// ... 其他引用保持原样

export const getStaticPaths = async () => {
  // 🟢 部署起飞：打包时返回空列表，Vercel 此时不会去连 Notion，部署瞬间完成
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps = withNavFooterStaticProps(
  async (context, sharedPageStaticProps) => {
    // 🟢 自动同步：revalidate 设为 1，意味着有人访问时会自动检查 Notion 更新
    return {
      props: {
        ...sharedPageStaticProps.props,
        // 这里放入抓取单篇文章的逻辑（保持你 2.0 的 post.js 里的抓取逻辑即可）
      },
      revalidate: 1 
    }
  }
)