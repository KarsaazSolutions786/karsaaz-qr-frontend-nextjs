/**
 * Unit Tests for RangeInput Component
 * @file tests/unit/components/range-input.test.tsx
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RangeInput, DualRangeInput } from '@/components/ui/range-input'

describe('RangeInput', () => {
  it('should render with default props', () => {
    render(<RangeInput />)
    const input = screen.getByRole('slider')
    expect(input).toBeInTheDocument()
  })

  it('should render with label', () => {
    render(<RangeInput label="Volume" />)
    expect(screen.getByText('Volume')).toBeInTheDocument()
  })

  it('should display current value', () => {
    render(<RangeInput value={50} showValue />)
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('should display value with unit', () => {
    render(<RangeInput value={50} unit="%" showValue />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should display min and max values', () => {
    render(<RangeInput min={10} max={90} showMinMax showValue={false} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('90')).toBeInTheDocument()
  })

  it('should call onChange when value changes', () => {
    const handleChange = vi.fn()
    render(<RangeInput onChange={handleChange} />)

    const input = screen.getByRole('slider')
    fireEvent.change(input, { target: { value: '75' } })

    expect(handleChange).toHaveBeenCalledWith(75)
  })

  it('should use formatValue for display', () => {
    const formatValue = (val: number) => `$${val}.00`
    render(<RangeInput value={50} formatValue={formatValue} showValue />)
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('should respect min and max bounds', () => {
    render(<RangeInput min={10} max={90} />)
    const input = screen.getByRole('slider')

    expect(input).toHaveAttribute('min', '10')
    expect(input).toHaveAttribute('max', '90')
  })

  it('should respect step value', () => {
    render(<RangeInput step={5} />)
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('step', '5')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<RangeInput disabled />)
    const input = screen.getByRole('slider')
    expect(input).toBeDisabled()
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<RangeInput size="sm" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()

    rerender(<RangeInput size="md" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()

    rerender(<RangeInput size="lg" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('should render with different variants', () => {
    const { rerender } = render(<RangeInput variant="default" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()

    rerender(<RangeInput variant="gradient" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()

    rerender(<RangeInput variant="success" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()

    rerender(<RangeInput variant="warning" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('should render marks', () => {
    const marks = [
      { value: 25, label: '25%' },
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
    ]
    render(<RangeInput marks={marks} />)

    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should handle defaultValue', () => {
    render(<RangeInput defaultValue={30} showValue />)
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('should call onChangeComplete on mouse up', () => {
    const handleChangeComplete = vi.fn()
    render(<RangeInput value={50} onChangeComplete={handleChangeComplete} />)

    const input = screen.getByRole('slider')
    fireEvent.mouseDown(input)
    fireEvent.mouseUp(input)

    expect(handleChangeComplete).toHaveBeenCalledWith(50)
  })

  it('should handle touch events', () => {
    const handleChangeComplete = vi.fn()
    render(<RangeInput value={50} onChangeComplete={handleChangeComplete} />)

    const input = screen.getByRole('slider')
    fireEvent.touchStart(input)
    fireEvent.touchEnd(input)

    expect(handleChangeComplete).toHaveBeenCalledWith(50)
  })

  it('should work as uncontrolled component', () => {
    const handleChange = vi.fn()
    render(<RangeInput defaultValue={20} onChange={handleChange} />)

    const input = screen.getByRole('slider')
    fireEvent.change(input, { target: { value: '40' } })

    expect(handleChange).toHaveBeenCalledWith(40)
  })

  it('should apply custom className', () => {
    const { container } = render(<RangeInput className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('DualRangeInput', () => {
  it('should render with min and max values', () => {
    render(<DualRangeInput minValue={20} maxValue={80} onChange={() => {}} />)
    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
  })

  it('should display range values', () => {
    render(
      <DualRangeInput
        label="Price Range"
        minValue={20}
        maxValue={80}
        showValues
        onChange={() => {}}
      />
    )
    expect(screen.getByText('20 - 80')).toBeInTheDocument()
  })

  it('should display label', () => {
    render(<DualRangeInput label="Price Range" minValue={20} maxValue={80} onChange={() => {}} />)
    expect(screen.getByText('Price Range')).toBeInTheDocument()
  })

  it('should display values with unit', () => {
    render(
      <DualRangeInput
        minValue={20}
        maxValue={80}
        unit="$"
        showValues
        label="Budget"
        onChange={() => {}}
      />
    )
    expect(screen.getByText('20$ - 80$')).toBeInTheDocument()
  })

  it('should call onChange when min value changes', () => {
    const handleChange = vi.fn()
    render(<DualRangeInput minValue={20} maxValue={80} onChange={handleChange} />)

    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[0], { target: { value: '30' } })

    expect(handleChange).toHaveBeenCalledWith(30, 80)
  })

  it('should call onChange when max value changes', () => {
    const handleChange = vi.fn()
    render(<DualRangeInput minValue={20} maxValue={80} onChange={handleChange} />)

    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[1], { target: { value: '90' } })

    expect(handleChange).toHaveBeenCalledWith(20, 90)
  })

  it('should not allow min to exceed max', () => {
    const handleChange = vi.fn()
    render(<DualRangeInput minValue={40} maxValue={60} step={1} onChange={handleChange} />)

    const sliders = screen.getAllByRole('slider')
    // Try to set min higher than max
    fireEvent.change(sliders[0], { target: { value: '70' } })

    // Should be clamped to maxValue - step
    expect(handleChange).toHaveBeenCalledWith(59, 60)
  })

  it('should not allow max to go below min', () => {
    const handleChange = vi.fn()
    render(<DualRangeInput minValue={40} maxValue={60} step={1} onChange={handleChange} />)

    const sliders = screen.getAllByRole('slider')
    // Try to set max lower than min
    fireEvent.change(sliders[1], { target: { value: '30' } })

    // Should be clamped to minValue + step
    expect(handleChange).toHaveBeenCalledWith(40, 41)
  })

  it('should use formatValue for display', () => {
    const formatValue = (val: number) => `$${val}`
    render(
      <DualRangeInput
        minValue={20}
        maxValue={80}
        formatValue={formatValue}
        showValues
        label="Price"
        onChange={() => {}}
      />
    )
    expect(screen.getByText('$20 - $80')).toBeInTheDocument()
  })

  it('should display min/max range labels', () => {
    render(
      <DualRangeInput min={0} max={100} minValue={20} maxValue={80} unit="%" onChange={() => {}} />
    )
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<DualRangeInput minValue={20} maxValue={80} disabled onChange={() => {}} />)
    const sliders = screen.getAllByRole('slider')
    expect(sliders[0]).toBeDisabled()
    expect(sliders[1]).toBeDisabled()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <DualRangeInput
        minValue={20}
        maxValue={80}
        className="custom-dual-range"
        onChange={() => {}}
      />
    )
    expect(container.firstChild).toHaveClass('custom-dual-range')
  })
})
