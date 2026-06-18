import { Icon } from '@/icon'
import { Popover } from '@/popover'
import { Tree, TreeModel, TreeProps } from '@/tree'
import {
  cn,
  useFocusClassName,
  BaseAllowClearProps,
  BaseOrientationProps,
  BasePlaceholderProps,
  BaseSelectProps,
  BaseSizeProps,
  BaseInputModel,
  useControllable,
  getSelectControllableOptions,
} from '@/utils'
import { Dict, treeToArray, debounce, keyBy } from '@syvobase/utils'
import {
  ReactNode,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Loading } from '@/loading'
import { useValidator, Validator } from '@/validation'
import { TagGroup, TagGroupProps } from '@/tagGroup'
import { mergeTag } from '@/utils/tag'
import { $t } from '@/utils/i18n'

export interface SelectProps<V = any>
  extends
    BaseSelectProps<V>,
    BasePlaceholderProps,
    BaseAllowClearProps,
    BaseOrientationProps,
    BaseSizeProps,
    Pick<
      TreeProps,
      | 'isTree'
      | 'isTreeData'
      | 'showEmptyParentNode'
      | 'onNodeClick'
      | 'defaultExpandLevel'
      | 'maxExpandLevel'
      | 'onItemsChange'
      | 'checkStrictly'
      | 'onFetchChildren'
      | 'onItemRender'
    >,
    RefAttributes<BaseInputModel> {
  // 过滤类型
  // 不开启搜索，本地搜索(如果是远程获取数据，会使用缓存的数据)，远程搜索
  filterType?: 'none' | 'local' | 'remote'
  // 服务端获取数据，如果不开启远程搜索，只会首次触发，且没有 keyword 值
  tagGroup?: TagGroupProps
  minHeight?: number
  maxHeight?: number
  cacheTextMap?: Dict
  fullName?: boolean
  isPopupSelect?: boolean
  onRemote?: (keyword: string) => Promise<Dict[]>
  // 当搜索后过滤的值
  onFilter?: (e: { keyword: string; node: Dict }) => boolean
  // 需要禁用的节点，无法选择
  onDisabledItem?: (node: Dict) => boolean
  // 打开事件
  onOpenChange?: (open: boolean) => void | Promise<void>
}

const tagClassName =
  'h-6 flex items-center rounded-md bg-primary pl-2 text-background mr-1 mb-1 cursor-default'

export const Select = ((props) => {
  const {
    ref,
    className,
    style,
    items = [],
    size = 'default',
    multiple = false,
    disabled = false,
    readMode = false,
    allowClear = false,
    filterType = 'none',
    fieldNames = {},
    placeholder = $t('select.placeholder'),
    isTree = false,
    isTreeData = false,
    minHeight = 0,
    maxHeight = 300,
    tagGroup = {},
    commaSplit = false,
    maxExpandLevel = 1,
    showEmptyParentNode,
    defaultExpandLevel,
    cacheTextMap = {},
    checkStrictly,
    fullName = false,
    isPopupSelect = false,
    onFilter,
    onRemote,
    onNodeClick,
    onDisabledItem,
    onItemsChange,
    onFetchChildren,
    onOpenChange,
    onItemRender,
  } = props
  const [value, setValue] = useControllable<SelectProps, 'value'>({
    props,
    value: undefined,
    ...getSelectControllableOptions({
      multiple,
      commaSplit,
    }),
  })

  const [keyword, setKeyword] = useState('')
  const {
    idKey = 'id',
    nameKey = 'name',
    parentIdKey = 'parentId',
    orderKey = 'order',
    colorKey = 'color',
  } = fieldNames
  const isEmpty = value.length === 0
  const [remoteData, setRemoteData] = useState<Record<string, any>[]>([])
  const remoteDataMap = keyBy(remoteData, idKey)
  const itemsMap = keyBy(
    isTreeData ? treeToArray(items, { idKey, parentIdKey, orderKey }) : items,
    idKey
  )
  const innerCacheTextMapRef = useRef<Record<string, string>>({})
  const getItem = (value: string) => {
    const item: any = remoteDataMap[value] ?? itemsMap[value]
    return item
  }
  const getText = (value: string) => {
    const item = getItem(value)
    let text: any
    if (item?.[nameKey]) {
      const names: string[] = []
      let currentItem = getItem(value)
      if (fullName) {
        while (currentItem) {
          names.unshift(currentItem[nameKey])
          currentItem = getItem(currentItem[parentIdKey])
        }
        text = names.join('/')
      } else {
        text = currentItem[nameKey]
      }
    }
    text =
      text ?? innerCacheTextMapRef.current[value] ?? cacheTextMap[value] ?? ''
    if (text !== '') {
      innerCacheTextMapRef.current[value] = text
    }
    return text
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const [focus, setFocus] = useState(false)
  const inputWidthDomRef = useRef<HTMLDivElement>(null)
  const [open, _setOpen] = useState(false)
  const hasFilter = !disabled && filterType !== 'none'
  const hasCursor = hasFilter && (focus || open)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const innerPlaceholder =
    keyword === '' &&
    (multiple
      ? isEmpty && placeholder
      : isEmpty
        ? placeholder
        : hasCursor
          ? getText(value[0])
          : '')

  const setOpen = (open: boolean) => {
    _setOpen(open)
    onOpenChange?.(open)
  }

  useEffect(() => {
    const inputWidthDom = inputWidthDomRef.current
    const inputDom = inputRef.current
    if (inputDom && inputWidthDom) {
      inputDom.style.width = `${inputWidthDom.clientWidth}px`
    }
  }, [keyword])

  useEffect(() => {
    if (open) {
      setRemoteData([])
    }
  }, [open])

  useEffect(() => {
    const inputDom = inputRef.current
    if (!inputDom) {
      return
    }
    if (hasCursor) {
      inputDom.value = ''
      inputDom.focus()
    } else {
      setKeyword('')
      inputDom.blur()
    }
  }, [hasCursor])

  const [loading, setLoading] = useState(false)
  const treeRef = useRef<TreeModel>(null)
  const popoverOpen = !disabled && open
  const focusClassName = useFocusClassName(popoverOpen)
  const { verifyClassName, validation, errorMsg } = useValidator({
    ...props,
    value,
  })

  useImperativeHandle(ref, () => ({
    validation,
    getText,
  }))

  const handleRemoteData = (() =>
    debounce(async (keyword: string) => {
      setLoading(true)
      try {
        const data = (await onRemote?.(keyword)) || []
        setRemoteData(data)
      } catch (error) {
        console.log(error)
        setRemoteData([])
      } finally {
        setLoading(false)
      }
    }, 1000))()

  useEffect(() => {
    const tableModel = treeRef.current
    if (!tableModel) {
      return
    }
    tableModel.filter((node: Dict) => {
      if (filterType !== 'local') {
        return true
      }

      return onFilter
        ? onFilter({ node, keyword } as any)
        : node.data[nameKey].toLowerCase().includes(keyword.toLowerCase())
    }, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  return readMode ? (
    <TagGroup
      value={value}
      getName={(id) => getText(id)}
      getColor={(id) => {
        return itemsMap[id]?.[colorKey]
      }}
      {...tagGroup}
    />
  ) : (
    <Validator errorMsg={errorMsg} validation={validation}>
      <div
        {...mergeTag('select', props)}
        className={cn('w-full flex-row', className)}
        style={style}
      >
        {(() => {
          const content = (
            <div
              className={cn(
                'border-border bg-background placeholder:text-muted-foreground relative flex w-full flex-row items-center rounded-md border text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
                focusClassName,
                {
                  sm: 'p-1',
                  default: 'p-1 pb-0!',
                  lg: 'p-2 pb-1!',
                }[size],
                hasFilter && 'cursor-text',
                className,
                verifyClassName
              )}
              style={style}
              onClick={() => {
                setFocus(true)
                if (isPopupSelect && !disabled) {
                  onOpenChange?.(true)
                }
              }}
              onBlur={() => {
                setFocus(false)
              }}
            >
              {disabled && (
                <div className='bg-background absolute top-0 left-0 z-50 h-full w-full cursor-not-allowed opacity-50'></div>
              )}
              <div
                className={cn(
                  'flex flex-1 overflow-x-auto',
                  multiple ? 'flex-wrap' : 'flex-row'
                )}
                style={{
                  width: 'calc(100% - 20px) ',
                }}
              >
                {multiple
                  ? value.map((id) => (
                      <div
                        key={id}
                        className={cn(
                          tagClassName,
                          'pr-1',
                          (disabled || isPopupSelect) && 'pr-2'
                        )}
                      >
                        {getText(id)}
                        {!disabled && !isPopupSelect && (
                          <div
                            className='text-background hover:text-background/50 ml-[2px] cursor-pointer'
                            onClick={() => {
                              setValue(value.filter((_id) => _id !== id))
                            }}
                          >
                            <Icon name='X' />
                          </div>
                        )}
                      </div>
                    ))
                  : !hasCursor && (
                      <div
                        className='mb-1 flex h-6 items-center'
                        style={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {getText(value[0])}
                      </div>
                    )}
                <div className='mb-1 flex h-6 flex-1 items-center'>
                  {hasFilter && (
                    <input
                      className={cn(
                        'relative top-[-.5px] m-0 border-none bg-transparent p-0 outline-none',
                        innerPlaceholder ? 'min-w-px' : 'min-w-[4px]'
                      )}
                      value={keyword}
                      ref={inputRef}
                      onChange={async (e) => {
                        const value = e.target.value
                        setKeyword(value)
                        if (filterType === 'remote') {
                          handleRemoteData(value)
                        }
                      }}
                      onBlur={(e) => {
                        if (hasCursor) {
                          e.target.focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Backspace' &&
                          multiple &&
                          keyword === ''
                        ) {
                          const newValue = [...value]
                          newValue.pop()
                          setValue(newValue)
                        }
                      }}
                    />
                  )}
                  {innerPlaceholder && (
                    <div className='text-foreground flex h-6 items-center'>
                      {innerPlaceholder}
                    </div>
                  )}
                  <div
                    ref={inputWidthDomRef}
                    className='absolute -z-50 opacity-0'
                  >
                    {keyword}
                  </div>
                </div>
              </div>
              <div className='flex'>
                {(allowClear || hasCursor) && !isEmpty && !isPopupSelect && (
                  <div
                    className='hover:text-foreground ml-1 flex size-5 cursor-pointer items-center justify-center'
                    onClick={() => {
                      setValue([])
                      setKeyword('')
                    }}
                  >
                    <Icon className='size-4' name='X' />
                  </div>
                )}
                <Icon
                  className='mb-1 size-5'
                  name={isPopupSelect ? 'SquareArrowUpRight' : 'ChevronDown'}
                />
              </div>
            </div>
          )
          if (isPopupSelect) {
            return content
          }
          return (
            <Popover
              trigger='click'
              open={popoverOpen}
              onOpenChange={disabled ? undefined : setOpen}
              className='border-border bg-background w-full border p-1'
              equalWidth
              content={
                loading ? (
                  <Loading className='h-16' />
                ) : (
                  <Tree
                    style={{
                      minHeight,
                      maxHeight,
                    }}
                    ref={treeRef}
                    isTree={isTree}
                    isTreeData={isTreeData}
                    showEmptyParentNode={showEmptyParentNode}
                    openKeys={openKeys}
                    onOpenKeysChange={setOpenKeys}
                    multiple={multiple}
                    maxExpandLevel={maxExpandLevel}
                    value={multiple ? value : value?.[0]}
                    items={filterType === 'remote' ? remoteData : items}
                    fieldNames={fieldNames}
                    checkStrictly={checkStrictly}
                    disabledArrowHover
                    enabledCheckboxRow
                    defaultExpandLevel={defaultExpandLevel}
                    onChange={(_newValue) => {
                      if (!multiple) {
                        setOpen(false)
                      }
                      setKeyword('')
                      if (multiple) {
                        setValue(_newValue)
                      } else {
                        let newValue = _newValue
                        newValue ??= ''
                        setValue(_newValue === '' ? [] : [_newValue])
                      }
                    }}
                    onNodeClick={onNodeClick}
                    onDisabledItem={onDisabledItem}
                    onItemsChange={onItemsChange}
                    onItemRender={onItemRender}
                    onFetchChildren={onFetchChildren}
                  />
                )
              }
            >
              {content}
            </Popover>
          )
        })()}
      </div>
    </Validator>
  )
}) as <V = any>(props: SelectProps<V>) => ReactNode
