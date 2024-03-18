import { React, type AllWidgetProps, appActions, getAppStore } from 'jimu-core'
import { Nav, NavItem } from 'jimu-ui'
import { SearchOutlined } from 'jimu-icons/outlined/editor/search'
import { WidgetEditorOutlined } from 'jimu-icons/outlined/brand/widget-editor'
import { PlusCircleFilled } from 'jimu-icons/filled/editor/plus-circle'
import './nav.scss'
import { useState } from 'react'
import { DataLineOutlined } from 'jimu-icons/outlined/gis/data-line'
import { FeatureLayerOutlined } from 'jimu-icons/outlined/gis/feature-layer'
import { ShowSelectionRtlOutlined } from 'jimu-icons/outlined/editor/show-selection--rtl'
import { ResetOutlined } from 'jimu-icons/outlined/editor/reset'
import { HomeOutlined } from 'jimu-icons/outlined/application/home'
import { PropertySettingOutlined } from 'jimu-icons/outlined/application/property-setting'
import { WidgetFilterOutlined } from 'jimu-icons/outlined/brand/widget-filter'
import { ChartBarOutlined } from 'jimu-icons/outlined/data/chart-bar'

const Widget = (props: AllWidgetProps<any>) => {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('home')

  const showCurrentSection = (order) => {
    const sectionDomItem = document.querySelector('.section-content')
    const sectionsArray = Array.from(sectionDomItem.children)
    sectionsArray.forEach((ele, i) => {
      const currentElement = ele as HTMLElement
      const firstChild = currentElement.firstElementChild as HTMLElement
      currentElement.style.opacity = '0'
      currentElement.style.display = 'none'
      firstChild.style.pointerEvents = 'none'
      if (order === i) {
        currentElement.style.opacity = '1'
        currentElement.style.display = 'block'
        firstChild.style.pointerEvents = 'all'
      }
    })
  }

  const showHistoryTable = () => {
    getAppStore().dispatch(
      appActions.widgetStatePropChange(
        // 'widget_17',
        'widget_19',
        'collapse',
        true
      ))
  }

  const hideHistoryTable = () => {
    getAppStore().dispatch(
      appActions.widgetStatePropChange(
        // 'widget_17',
        'widget_19',
        'collapse',
        false
      ))
  }

  const showSidebar = () => {
    getAppStore().dispatch(
      appActions.widgetStatePropChange(
        'widget_1',
        'collapse',
        true
      ))
  }

  const closeSidebar = (e) => {
    getAppStore().dispatch(
      appActions.widgetStatePropChange(
        'widget_1',
        'collapse',
        false
      ))
    setActiveItem(e.target.value)
    hideHistoryTable()
  }

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  const handleNavItemClick = (e) => {
    const orderObject = {
      search: 0,
      filterproj: 1,
      analytics: 2,
      add: 3,
      review: 4,
      acquisition: 5,
      history: 6
    }

    const currentItem = e.target.value
    const currentItemIndex = orderObject[currentItem]
    e.stopPropagation()
    showSidebar()
    setActiveItem(e.target.value)
    showCurrentSection(currentItemIndex)

    props.dispatch(appActions.widgetStatePropChange('nav', 'activeWidget', e.target.value))
    hideHistoryTable()
    if (e.target.value === 'history') {
      showHistoryTable()
    }
  }

  return (
    <section onMouseLeave={handleMouseLeave}>
        <Nav vertical>
        
          <NavItem className={'nav-link'}  >
              <button type='button' className={`srch-button `} onClick={handleNavItemClick} value='search'>
                <SearchOutlined size='l' className='nav-icon'/>
                <span className={`hover-text ${open ? '' : 'hidden'}`}>Search</span>
              </button>
          </NavItem>
          <NavItem className={'nav-link'} onMouseEnter={handleMouseEnter} >
              <button type='button' className={`link-button ${activeItem === 'home' ? 'active' : ''}`} onClick={closeSidebar} value='home'>
                <HomeOutlined size='l' className='nav-icon'/>
                <span className={`hover-text ${open ? '' : 'hidden'}`}>Home</span>
              </button>
          </NavItem>
          <NavItem className="nav-link" onMouseEnter={handleMouseEnter} >
              <button className={`link-button ${activeItem === 'filterproj' ? 'active' : ''}`} onClick={handleNavItemClick} value='filterproj'>
              <WidgetFilterOutlined size='l' className='nav-icon'/>
              <span className={`hover-text ${open ? '' : 'hidden'}`}>Filter Projects</span>
              </button>
          </NavItem>
          
          <NavItem className="nav-link" onMouseEnter={handleMouseEnter} >
              <button className={`link-button ${activeItem === 'analytics' ? 'active' : ''}`} onClick={handleNavItemClick} value='analytics'>
              <ChartBarOutlined size='l' className='nav-icon'/>
              <span className={`hover-text ${open ? '' : 'hidden'}`}>Analytics</span>
              </button>
          </NavItem>
          {/* <NavItem className="nav-link" onMouseEnter={handleMouseEnter} >
              <button className={`link-button ${activeItem === 'review' ? 'active' : ''}`} onClick={handleNavItemClick} value='review'>
              <ShowSelectionRtlOutlined size='l' className='nav-icon'/>
              <span className={`hover-text ${open ? '' : 'hidden'}`}>Review</span>
              </button>
          </NavItem>
          <NavItem className="nav-link" onMouseEnter={handleMouseEnter} >
              <button className={`link-button ${activeItem === 'acquisition' ? 'active' : ''}`} onClick={handleNavItemClick} value='acquisition'>
              <FeatureLayerOutlined size='l' className='nav-icon'/>
              <span className={`hover-text ${open ? '' : 'hidden'}`}>Land Acquisition</span>
              </button>
          </NavItem>
          <NavItem className="nav-link" onMouseEnter={handleMouseEnter} >
              <button className={`link-button ${activeItem === 'history' ? 'active' : ''}`} onClick={handleNavItemClick} value='history'>
              <ResetOutlined size='l' className='nav-icon'/>
              <span className={`hover-text ${open ? '' : 'hidden'}`}>History</span>
              </button>
          </NavItem> */}
          {/* Add more NavItems as needed */}
        </Nav>
  </section>
  )
}

export default Widget
