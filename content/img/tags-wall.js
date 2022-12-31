;(function () {
  const Color = {
    format (color) {
      if (color[0] === '#') {
        return Utils.Color.switch16toRGB(color)
      } else if (color.indexOf('rgb') === 0) {
        return color
      } else {
        return Utils.Color.switch16toRGB('#' + color)
      }
    },
    switch16toRGB (color) {
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        return `rgb(${r},${g},${b})`
    },
    getRGB (rgbColor) {
      return rgbColor.match(/rgb\((\d+),(\d+),(\d+)\)/).slice(1)
    },
    getGeryLevel (rgbColor) {
      const [R, G, B] = Utils.Color.getRGB(rgbColor)
      return R * 0.299 + G * 0.587 + B * 0.114
    },
    isDeep (rgbColor) {
      return Utils.Color.getGeryLevel(rgbColor) >= 192
    }
  }

  const DOM = {
    setStyle (dom, styles) {
      if (!dom) return
      for (let sKey in styles) {
        dom.style[sKey] = styles[sKey]
      }
    },
    create (tagName, properties) {
      const $ = document.createElement(tagName)
      if (properties.style) {
        DOM.setStyle($, properties.style)
      }
      for (const key in properties) {
        $[key] = properties[key]
      }
      return $
    }
  }

  const Debounce = (time) => {
    let timer
    return {
      exec (fn) {
        clearTimeout(timer)
        timer = setTimeout(fn, time)
      },
      cancel () {
        clearTimeout(timer)
      }
    } 
  }

  const Shuffle = (arr) => 
    arr.map(v => ({ v, sort: Math.random()})).sort((a, b) => a.sort - b.sort).map(v => v.v)

  window.Utils = {
    Color,
    DOM,
    Debounce,
    Shuffle
  }
})()

const Tags = ({ style, text, rootDOM }) => {
  style = style || { fn: Style1 }
  rootDOM = rootDOM || document.body

  if (!text) {
    throw new Error('need text')
  }

  /* Basic */
  const $tags = Utils.DOM.create('div', { id: 'my-tags' })
  const $style = document.createElement('style')

  rootDOM.append($style, $tags)

  const preprocess = (txt) => {
    return txt.split('\n').slice(0, -1)
      .filter(item => item.indexOf('//') !== 0 && item !== '')
      .map(item => item.split('/').slice(0, 3).concat([item.split('/').slice(3).join('/')]))
  }

  const render = (data) => {
    data.forEach(item => $tags.innerHTML += genMarkHTML(item))
  }

  const genMarkHTML = (item) => {
    const [tag, score, type, link] = item
    const a = (text, link) => `<a href="${link}" target="_blank">${text}</a>`
    Math.random()
    const randNum = Math.random()
    const computedScore = score || (style.randomScoreIfNoSetting ? Math.ceil(randNum * 10) : 5)
    return `
      <mark data-rand="${randNum}" data-score="${computedScore}" class="score-${computedScore}" data-type="${type || ''}">
      ${link ? a(tag, link) : tag}
      </mark>
    `
  }

  const filter = (data, type) => data.filter(item => item[2] === type)

  const Data = Utils.Shuffle(preprocess(text))

  render(Data)
  style.rootDOM = rootDOM
  style.fn(Data, document.getElementsByTagName('mark'), $tags, $style, style)
}

const Style1 = (data, marks, $tags, $style, Config) => {
  marks = Array.prototype.slice.call(marks)

  Config.scale = Config.scale || 1
  Utils.DOM.setStyle(Config.rootDOM, {
    position: 'relative',
    overflowX: 'hidden'
  })

  // const Size = [2.5, 3.5, 4.3, 5.1, 5.8, 6.5, 7, 7.5, 8, 8.4, 8.8]
  const Size = [2.5, 3.2, 3.9, 4.5, 5.1, 5.6, 6.1, 6.5, 6.9, 7.3, 7.7]
  const Color = (Array.isArray(Config.color) ? Config.color : [
    '#776D9A',  '#7C99B4', '#6B7F82','#418CA1','#699BB0','#ABA689','#8099A0','#9D8697','#AAAAAA','#8D919F','#8196A2','#5A8996','#7E9D94'
  ]).map(color => Utils.Color.format(color))
  const FontSize = (size) => size * 5 * Config.scale

  const getIntFromRand = (rand, end) => Math.floor(parseFloat(rand) * end)

  const genBgColor = (randNum) => Color[getIntFromRand(randNum, Color.length)]
  const genCSS = () => {
    const genStyle = (index) => `.score-${index} { font-size: ${FontSize(Size[index])}px }`
    return Array.from(Array(11)).map((_, i) => genStyle(i)).join('\n')
  }
  const genFontColor = (rgbBgColor) => Utils.Color.isDeep(rgbBgColor) ? '#555' : '#fff'

  const $bg = document.createElement('div')
  Utils.DOM.setStyle($bg, {
    position: 'absolute',
    zIndex: '-1',
    fontSize: 11 * Config.scale + 'rem',
    color: '#26262e30',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    top: '0', left: '0'
  })
  $bg.innerText = Config.title

  Config.rootDOM.appendChild($bg)

  const debounce = Utils.Debounce(200)

  marks.forEach($e => {
    const bgColor = genBgColor(parseFloat($e.dataset.rand))
    Math.random()
    Utils.DOM.setStyle($e, {
      backgroundColor: bgColor,
      color: genFontColor(bgColor),
      top: getIntFromRand(Math.random(), 90, Math.random()) + '%',
      left: getIntFromRand(Math.random(), 85) + '%',
      zIndex: (11 - $e.dataset.score).toString()
    })
    Utils.DOM.setStyle($e.getElementsByTagName('a')[0], {
      color: genFontColor(bgColor),
      textDecoration: 'none'
    })
    if (Config.animation) {
      setTimeout(() => {
        Utils.DOM.setStyle($e, {
          animation: `${Math.random() > 0.5 ? 'float' : 'float-reverse'} ${Math.random() * 5 + 7}s linear infinite`
        })
      }, 5000 * Math.random())
    }
    $e.onmouseover = () => {
      debounce.exec(() => {
        const curType = $e.dataset.type
        marks.forEach(mark => {
          if (curType && mark.dataset.type === curType) {
            mark.style.opacity = 1
            mark.style.zIndex = 10 + parseInt(mark.style.zIndex)
            $bg.innerText = curType
          } else {
            mark.style.opacity = .1
          }
        })
        $e.style.opacity = 1
        $e.style.zIndex = 21
      })
    }
    $e.onmouseout = () => {
      debounce.cancel()
      marks.forEach(mark => {
        mark.style.opacity = .8
        mark.style.zIndex = 11 - mark.dataset.score
      })
      $bg.innerText = Config.title
    }
  })

  $style.innerHTML = genCSS() + `
    #my-tags { overflow-x: hidden; padding: 7%; text-align: center; width: 100%; height: 100%; position: relative; box-sizing: border-box; }
    #my-tags a::after { content: "🎐"; }
    #my-tags a:hover::after { animation: move .3s linear infinite; position: relative; }
    #my-tags mark { position: absolute; padding: .2em .3em; display: inline-block; border-radius: .3em; margin: .15em .1em; opacity: .8; transition: opacity .2s; }
    @media (max-width: 1000px) {
      #my-tags mark { animation: none !important; }
    }
    @media (max-width: 600px) {
      #my-tags mark { position: unset; }
      html { overflow-x: hidden; font-size: 10px; }
    }
    @keyframes move {
      0% { left: 0px }
      50% { left: 1% }
      100 { left: 0px }
    }
    @keyframes float {
      0% { transform: translatey(0px) rotate(0deg); }
      15% { transform: translatey(-3%) rotate(4deg); }
      30% { transform: translatey(-5%) rotate(7deg); }
      45% { transform: translatey(-2%) rotate(4deg); }
      60% { transform: translatey(2%) rotate(-2deg); }
      75% { transform: translatey(5%) rotate(-6deg); }
      90% { transform: translatey(3%) rotate(-3deg); }
      100% { transform: translatey(0px) rotate(0deg); }
    }
    @keyframes float-reverse {
      0% { transform: translatey(0px) rotate(0deg); }
      15% { transform: translatey(3%) rotate(-4deg); }
      30% { transform: translatey(5%) rotate(-7deg); }
      45% { transform: translatey(2%) rotate(-4deg); }
      60% { transform: translatey(-2%) rotate(2deg); }
      75% { transform: translatey(-5%) rotate(6deg); }
      90% { transform: translatey(-3%) rotate(3deg); }
      100% { transform: translatey(0px) rotate(0deg); }
    }
  `

}