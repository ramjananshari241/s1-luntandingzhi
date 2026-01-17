import { ProfileWidget } from '../widget/ProfileWidget'
import { StatsWidget } from '../widget/StatsWidget'

export const WidgetCollection = ({
  widgets,
}: {
  widgets: { [key: string]: any }
}) => {
  return (
    <div
      className="mb-6 grid grid-cols-2 gap-4 md:gap-8 lg:gap-10"
      data-aos="fade-up"
    >
      {/* 左侧：Profile 组件 (保持不变) */}
      <ProfileWidget data={widgets.profile} />
      
      {/* 右侧：公告板 (改为传递 announcement 数据) */}
      {/* 逻辑说明：如果 Notion 中配置正确，widgets 对象里会自动包含 announcement */}
      <StatsWidget data={widgets.announcement} />
    </div>
  )
}
