import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { MenuItem, MenuItemLeaf, MenuItemNode } from 'app/components/Header/useMenu'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import useDesktopMediaQuery, { useTouchDeviceMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { useDexWarningOpen } from 'app/state/application/hooks'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useCallback, useRef } from 'react'
// @ts-ignore: Unreachable code error
// eslint-disable-next-line simple-import-sort/imports
import { Arwes, ThemeProvider, Button, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds } from 'arwes';

interface NavigationItem {
  node: MenuItem
}

export const NavigationItem: FC<NavigationItem> = ({ node }) => {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isDesktop = useDesktopMediaQuery()
  const touchDevice = useTouchDeviceMediaQuery()
  const showUseDexWarning = useDexWarningOpen()

  const handleToggle = useCallback((open, type) => {
    if (!open && type === 'enter') {
      buttonRef?.current?.click()
    } else if (open && type === 'leave') {
      buttonRef?.current?.click()
    }
  }, [])

  if (node && node.hasOwnProperty('link')) {
    const { link, external } = node as MenuItemLeaf
    if (external) {

      return (
        <div className='mt-3 mr-5 lg:mr-0 lg:mt-1'>
          <Frame
            level={3}
            corners={2}
            layer='primary'
          >
            <div className="hover:bg-blue-100/25" style={{ transition: 'background-color 0.5s ease' }}>
              <Typography
                weight={700}
                variant="sm"
                className={classNames(
                  router.asPath === link ? 'text-white' : '',
                  'hover:text-white font-bold py-2 px-2 rounded flex gap-3'
                )}
              >
                <a href={link} target="_blank" rel="noreferrer">
                  <div className="flex flex-row">
                    {node.icon}
                    <div className={classNames('ml-2')}>
                      <span>{node.title}</span>
                    </div>
                  </div>
                </a>
              </Typography>
            </div>
          </Frame>
        </div>
      )
    }

    return (
      <div className='mt-3 mr-5 lg:mr-0 lg:mt-1'>
        <Frame
          level={3}
          corners={2}
          layer='primary'
          className="w-full"
        >
          <div className="hover:bg-blue-100/25" style={{ transition: 'background-color 0.5s ease' }}>
            <Typography
              onClick={() => router.push(link)}
              weight={700}
              variant="sm"
              className={classNames(
                router.asPath === link ? 'text-white' : '',
                'hover:text-white font-bold py-2 px-2 rounded flex gap-3'
              )}
            >
              {node.icon}
              <span>{node.title}</span>
            </Typography>
          </div>
        </Frame>
      </div>
    )
  }

  return (
    <Popover key={node.key} className="relative flex">
      {({ open }) => (
        <div
          className="w-full mt-3 mr-5 lg:mr-0 lg:mt-1"
          {...(!touchDevice && {
            onMouseEnter: () => handleToggle(open, 'enter'),
            onMouseLeave: () => handleToggle(open, 'leave'),
          })}
        >
          <Frame
            level={3}
            corners={2}
            className="w-full"
            layer='primary'
          >
            <div className="hover:bg-blue-100/25" style={{ transition: 'background-color 0.5s ease' }}>
              <Popover.Button ref={buttonRef}>
                <Typography
                  weight={700}
                  variant="sm"
                  className={classNames(open ? 'text-white' : '', 'font-bold py-2 px-2 rounded flex gap-3 items-center')}
                >
                  {node.icon}
                  <span>{node.title}</span>
                  <ChevronDownIcon strokeWidth={5} width={12} />
                </Typography>
              </Popover.Button>
            </div>
          </Frame>
          {node.hasOwnProperty('items') && (
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="z-10 w-full absolute w-40 translate-y-[-8px] translate-x-[-8px] ">
                <Frame
                  level={3}
                  corners={2}
                  layer='primary'
                >
                  <div
                    className={classNames(
                      'shadow-md shadow-black/40 border border-dark-700 rounded overflow-hidden',
                      !touchDevice
                        ? "backdrop-blur-fallback before:z-[-1] before:rounded before:absolute before:w-full before:h-full before:content-['']  bg-white bg-opacity-[0.02]"
                        : 'bg-dark-800 inset-0',
                      showUseDexWarning ? 'before:backdrop-blur-[40px]' : 'before:backdrop-blur-[20px]'
                    )}
                  >
                    {(node as MenuItemNode).items.map((leaf) => (
                      <Typography
                        variant="sm"
                        weight={700}
                        key={leaf.key}
                        onClick={() => {
                          router.push(leaf.link).then(() => buttonRef?.current?.click())
                        }}
                        className="relative px-3 py-2 m-1 rounded-lg hover:cursor-pointer hover:text-white hover:bg-white/10"
                      >
                        {leaf.title}
                      </Typography>
                    ))}
                  </div>
                </Frame>
              </Popover.Panel>
            </Transition>
          )}
        </div>
      )}
    </Popover>
  )
}
