import { ProfileWidget } from '../widget/ProfileWidget'
import { StatsWidget } from '../widget/StatsWidget'

export const WidgetCollection = ({
  widgets,
}: {
  widgets: { [key: string]: any }
}) => {
  // 关键：获取 announcement 数组，如果没有则传 undefined，让组件内部处理兜底
  // 注意：NotionNext/Anzifan 的数据结构中，自定义类型的文章可能会被归类到 
  // widgets.announcement (如果后端配置了) 
  // 或者你需要检查一下 data props 里的 allPosts 并自行过滤。
  
  // 假设后端已经按照 type 分组了
  const announcements = widgets?.announcement || []

  return (
    <div
      className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
      data-aos="fade-up"
    >
      <ProfileWidget data={widgets.profile} />
      {/* 传递公告数据 */}
      <StatsWidget data={announcements} />
    </div>
  )
}
