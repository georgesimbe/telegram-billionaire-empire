# Telegram Billionaire Sim - UI Style Guide

## Design System Overview

This style guide ensures consistency across all pages and components in the Telegram Billionaire Sim app.

## Color Palette

### Primary Colors

- **Background**: `bg-gray-900` (#111827)
- **Card Background**: `bg-gray-800` (#1f2937)
- **Secondary Background**: `bg-gray-700` (#374151)

### Text Colors

- **Primary Text**: `text-white`
- **Secondary Text**: `text-gray-400`
- **Muted Text**: `text-gray-500`

### Accent Colors

- **Primary Blue**: `text-blue-400`, `bg-blue-600`
- **Success Green**: `text-green-400`, `bg-green-600`
- **Warning Yellow**: `text-yellow-400`, `bg-yellow-600`
- **Danger Red**: `text-red-400`, `bg-red-600`
- **Cash Green**: `text-green-400` (for money displays)

### Special Colors

- **Staking Gradient**: `bg-gradient-to-r from-blue-900 to-purple-900` (unique to staking page)

## Typography

### Headings

- **Page Title**: `text-2xl font-bold text-white`
- **Section Title**: `text-xl font-bold text-white`
- **Card Title**: `text-lg font-semibold text-white`
- **Subsection**: `text-base font-medium text-white`

### Body Text

- **Primary**: `text-sm text-white`
- **Secondary**: `text-sm text-gray-400`
- **Caption**: `text-xs text-gray-500`

## Layout Standards

### Page Structure

```jsx
<div className="p-4 max-w-4xl mx-auto pb-20">
  <PageHeader 
    title="Page Title"
    subtitle="Optional subtitle"
    showCash={true} // for relevant pages
    cash={player.cash}
  />
  
  {/* Page content */}
</div>
```

### Spacing

- **Page Padding**: `p-4`
- **Bottom Padding**: `pb-20` (for navigation clearance)
- **Section Spacing**: `space-y-6`
- **Card Spacing**: `mb-6`

## Component Standards

### PageHeader Component

Use for all page headers to ensure consistency:

```jsx
<PageHeader
  title="Page Title"
  subtitle="Optional subtitle"
  description="Optional description"
  showCash={boolean}
  cash={number}
  icon={IconComponent}
  rightContent={ReactNode}
/>
```

### Card Component

Standard card layout:

```jsx
<Card 
  title="Card Title"
  subtitle="Optional subtitle"
  headerAction={ReactNode}
  className="mb-6"
>
  {/* Card content */}
</Card>
```

### Button Component

Standardized button variants:

```jsx
<Button variant="primary|secondary|success|warning|danger|outline|ghost" size="sm|md|lg|xl">
  Button Text
</Button>
```

### TabNavigation Component

Consistent tab styling:

```jsx
<TabNavigation
  tabs={tabsArray}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="default|pills|underline"
/>
```

## Page-Specific Guidelines

### Homepage

- Use PageHeader with cash display
- Life Overview card with StatCard components
- Quick action cards with consistent styling

### Career Page

- PageHeader with info icon
- Tab navigation for different sections
- Progress bars for education/skills

### Business Page

- PageHeader with cash display
- Industry sector filtering
- Business cards with purchase/upgrade actions

### Social Page

- PageHeader with description
- Tab navigation for life aspects
- Housing and relationship management

### Staking Page

- **Special**: Maintains gradient background for differentiation
- Economic portfolio overview
- Staking pool cards

### Profile Page

- User avatar and level display
- Customization options
- Privacy settings

### Settings Page

- Simple header
- Tab navigation for settings categories
- Premium feature highlighting

## Interactive States

### Hover States

- Cards: `hover:bg-gray-750` (subtle lightening)
- Buttons: Defined in Button component variants
- Navigation: `hover:text-white hover:bg-gray-700`

### Focus States

- All interactive elements should have visible focus states
- Use `focus:ring-2 focus:ring-blue-500` for accessibility

### Loading States

- Use spinner animation for loading buttons
- Skeleton loading for content areas

## Responsive Design

### Breakpoints

- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

### Grid Layouts

- **Stats**: `grid-cols-2 md:grid-cols-4`
- **Cards**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Business Items**: `grid-cols-1 lg:grid-cols-2`

## Accessibility

### Requirements

- All interactive elements must be keyboard accessible
- Color contrast ratios must meet WCAG AA standards
- Screen reader friendly markup
- Focus indicators on all interactive elements

### Implementation

- Use semantic HTML elements
- Provide alt text for images
- Use ARIA labels where needed
- Ensure proper heading hierarchy

## Animation Guidelines

### Transitions

- Use `transition-all duration-200` for smooth interactions
- Hover effects should be subtle and fast
- Loading states should use consistent spinner animation

### Motion

- Prefer subtle animations over dramatic effects
- Use Framer Motion for complex animations
- Maintain 60fps performance

## Best Practices

### Do's

✅ Use standardized components (PageHeader, Card, Button, etc.)
✅ Maintain consistent spacing and typography
✅ Follow the established color palette
✅ Ensure responsive design works on all devices
✅ Test accessibility features

### Don'ts

❌ Create custom button styles without using Button component
❌ Use inconsistent spacing or colors
❌ Ignore responsive design considerations
❌ Skip accessibility testing
❌ Use animations that impact performance

## Future Considerations

### Planned Improvements

- Dark/light theme toggle
- Advanced animation system
- Component library expansion
- Performance optimizations

### Maintenance

- Regular design system audits
- Component usage tracking
- User feedback integration
- Performance monitoring
