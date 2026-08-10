import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Breadcrumbs } from '../components/common/Breadcrumbs'

describe('Breadcrumbs Component', () => {
  it('renders breadcrumb items correctly', () => {
    const items = [
      { label: 'Services', path: '/services' },
      { label: 'Dangerous Goods Transport' },
    ]
    render(
      <MemoryRouter>
        <Breadcrumbs items={items} />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Dangerous Goods Transport')).toBeInTheDocument()
  })
})
