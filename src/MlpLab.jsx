import { useEffect, useRef, useState } from 'react'

const stations = [
  {
    title: '装载两个特征',
    tag: 'INPUT',
    formula: 'x = [0.80, 0.60]',
    summary: '专注度和截止时间紧迫度组成二维输入向量。此时数据只是数值，还没有经过任何权重。',
  },
  {
    title: '乘以第一层权重',
    tag: 'WEIGHTED SUM',
    formula: 'h₁ = .80 × .60 + .60 × (−1.40)\nh₂ = .80 × .40 + .60 × .80\nh₃ = .80 × .90 + .60 × 1.10',
    summary: '三个隐藏神经元同时读取两个输入，但每一条连接都有不同的权重。',
  },
  {
    title: '加入隐藏层偏置',
    tag: 'BIAS',
    formula: 'z₁ = 0.48 − 0.84 − 0.10 = −0.46\nz₂ = 0.32 + 0.48 − 0.20 = 0.60\nz₃ = 0.72 + 0.66 − 0.30 = 1.08',
    summary: '偏置为每个神经元提供一个独立起点，决定它在输入为零时的基础倾向。',
  },
  {
    title: '用 ReLU 过滤信号',
    tag: 'RELU',
    formula: 'a = max(0, z)\n→ a = [0.00, 0.60, 1.08]',
    summary: 'ReLU 只保留正值。h₁ 的负信号在这里归零，不再影响后续输出。',
  },
  {
    title: '送向输出层',
    tag: 'HIDDEN → OUTPUT',
    formula: '0 × .55 = 0.000\n.60 × .65 = 0.390\n1.08 × .85 = 0.918',
    summary: '三个激活值分别乘上输出层权重。h₃ 的激活值最高，因此贡献也最大。',
  },
  {
    title: '汇总成 Logit',
    tag: 'LOGIT',
    formula: 'z² = 0.000 + 0.390 + 0.918 − 0.530\nz² = 0.778',
    summary: '贡献相加，再减去输出层偏置，得到尚未压缩的原始得分 0.778。',
  },
  {
    title: '用 Sigmoid 变成概率',
    tag: 'SIGMOID',
    formula: 'ŷ = 1 ÷ (1 + e^(−0.778))\nŷ ≈ 0.685 → 68.5%',
    summary: 'Sigmoid 将 Logit 压缩到 0 和 1 之间，输出“今晚能完成任务”的概率。',
  },
]

const networkNodes = {
  inputs: [
    { x: 0.13, y: 0.36, label: '专注度', value: '0.80', color: '#62e6e2' },
    { x: 0.13, y: 0.66, label: '紧迫度', value: '0.60', color: '#84a7ff' },
  ],
  hidden: [
    { x: 0.49, y: 0.24, label: 'h₁', value: '0.00', color: '#ff8a68' },
    { x: 0.49, y: 0.51, label: 'h₂', value: '0.60', color: '#62e6e2' },
    { x: 0.49, y: 0.78, label: 'h₃', value: '1.08', color: '#84a7ff' },
  ],
  output: { x: 0.84, y: 0.51, label: 'ŷ', value: '68.5%', color: '#62e6e2' },
}

const firstLayerWeights = [
  [0.6, -1.4],
  [0.4, 0.8],
  [0.9, 1.1],
]

const secondLayerWeights = [0.55, 0.65, 0.85]

const shipStops = [
  { x: 0.08, y: 0.78 },
  { x: 0.25, y: 0.32 },
  { x: 0.36, y: 0.72 },
  { x: 0.48, y: 0.51 },
  { x: 0.61, y: 0.31 },
  { x: 0.72, y: 0.72 },
  { x: 0.91, y: 0.51 },
]

function MlpCanvas({ step }) {
  const canvasRef = useRef(null)
  const stepRef = useRef(step)
  const shipRef = useRef({ ...shipStops[0] })
  const targetRef = useRef({ ...shipStops[0] })

  stepRef.current = step
  targetRef.current = shipStops[Math.max(0, step)]

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 1
    let height = 1
    let frameId = 0
    let lastTime = performance.now()
    let isVisible = false

    const point = (node) => ({
      x: node.x * width,
      y: node.y * height,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const line = (from, to, color, lineWidth = 1, alpha = 1) => {
      context.save()
      context.globalAlpha = alpha
      context.strokeStyle = color
      context.lineWidth = lineWidth
      context.beginPath()
      context.moveTo(from.x, from.y)
      context.lineTo(to.x, to.y)
      context.stroke()
      context.restore()
    }

    const pulse = (from, to, phase, color) => {
      context.save()
      context.fillStyle = color
      context.shadowColor = color
      context.shadowBlur = 11
      context.beginPath()
      context.arc(
        from.x + (to.x - from.x) * phase,
        from.y + (to.y - from.y) * phase,
        2.6,
        0,
        Math.PI * 2,
      )
      context.fill()
      context.restore()
    }

    const drawBackground = (time) => {
      const background = context.createRadialGradient(
        width * 0.57,
        height * 0.46,
        10,
        width * 0.57,
        height * 0.46,
        Math.max(width, height) * 0.76,
      )
      background.addColorStop(0, 'rgba(22, 49, 77, 0.94)')
      background.addColorStop(0.58, 'rgba(8, 24, 38, 0.96)')
      background.addColorStop(1, 'rgba(4, 13, 22, 1)')
      context.fillStyle = background
      context.fillRect(0, 0, width, height)

      context.save()
      context.strokeStyle = 'rgba(202, 225, 255, 0.055)'
      context.lineWidth = 1
      const horizon = height * 0.43
      for (let index = 0; index < 15; index += 1) {
        const y = horizon + Math.pow(index / 14, 1.65) * height * 0.6
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }
      for (let index = -8; index <= 8; index += 1) {
        context.beginPath()
        context.moveTo(width * 0.5 + index * 14, horizon)
        context.lineTo(width * 0.5 + index * width * 0.09, height)
        context.stroke()
      }

      for (let index = 0; index < 38; index += 1) {
        const seedX = (index * 137.5) % 100
        const seedY = (index * 79.3) % 100
        const twinkle = reducedMotion ? 0.65 : 0.4 + Math.sin(time / 900 + index) * 0.22
        context.globalAlpha = twinkle * 0.24
        context.fillStyle = '#62e6e2'
        context.fillRect((seedX / 100) * width, (seedY / 100) * height, index % 5 === 0 ? 1.5 : 1, index % 5 === 0 ? 1.5 : 1)
      }
      context.restore()
    }

    const drawNetwork = (time) => {
      const inputPoints = networkNodes.inputs.map(point)
      const hiddenPoints = networkNodes.hidden.map(point)
      const outputPoint = point(networkNodes.output)

      firstLayerWeights.forEach((weights, hiddenIndex) => {
        weights.forEach((weight, inputIndex) => {
          const color = weight < 0 ? 'rgba(255, 112, 74, 0.76)' : 'rgba(98, 230, 226, 0.72)'
          const alpha = 0.09 + Math.min(Math.abs(weight) / 1.5, 1) * 0.23
          line(inputPoints[inputIndex], hiddenPoints[hiddenIndex], color, 1, alpha)
          if (!reducedMotion && stepRef.current >= 1 && stepRef.current <= 3) {
            const phase = (time / 1450 + hiddenIndex * 0.17 + inputIndex * 0.31) % 1
            pulse(inputPoints[inputIndex], hiddenPoints[hiddenIndex], phase, weight < 0 ? '#ff704a' : '#62e6e2')
          }
        })
      })

      secondLayerWeights.forEach((weight, hiddenIndex) => {
        const alpha = 0.1 + Math.min(Math.abs(weight), 1) * 0.28
        line(hiddenPoints[hiddenIndex], outputPoint, 'rgba(98, 230, 226, 0.7)', 1.2, alpha)
        if (!reducedMotion && stepRef.current >= 4) {
          const phase = (time / 1300 + hiddenIndex * 0.22) % 1
          pulse(hiddenPoints[hiddenIndex], outputPoint, phase, hiddenIndex === 0 ? '#455362' : '#62e6e2')
        }
      })

      const outputGlow = context.createRadialGradient(
        outputPoint.x,
        outputPoint.y,
        2,
        outputPoint.x,
        outputPoint.y,
        Math.min(width, height) * 0.2,
      )
      outputGlow.addColorStop(0, stepRef.current >= 5 ? 'rgba(98, 230, 226, 0.24)' : 'rgba(98, 230, 226, 0.09)')
      outputGlow.addColorStop(1, 'rgba(98, 230, 226, 0)')
      context.fillStyle = outputGlow
      context.fillRect(0, 0, width, height)

      const drawNode = (node, position, radius, active, muted = false) => {
        context.save()
        context.globalAlpha = muted ? 0.3 : active ? 1 : 0.68
        if (active) {
          context.shadowColor = node.color
          context.shadowBlur = 19
        }
        context.fillStyle = 'rgba(8, 24, 37, 0.95)'
        context.strokeStyle = node.color
        context.lineWidth = active ? 2 : 1.2
        context.beginPath()
        context.arc(position.x, position.y, radius, 0, Math.PI * 2)
        context.fill()
        context.stroke()
        context.shadowBlur = 0
        context.fillStyle = node.color
        context.font = `${Math.max(10, Math.min(15, width / 70))}px Inter, sans-serif`
        context.textAlign = 'center'
        context.fillText(node.label, position.x, position.y + 4)
        context.fillStyle = 'rgba(227, 240, 255, 0.62)'
        context.font = `${Math.max(8, Math.min(11, width / 100))}px "Cascadia Code", Consolas, monospace`
        context.fillText(node.value, position.x, position.y + radius + 18)
        context.restore()
      }

      networkNodes.inputs.forEach((node, index) => {
        drawNode(node, inputPoints[index], Math.max(14, Math.min(27, width * 0.03)), stepRef.current >= 0)
      })
      networkNodes.hidden.forEach((node, index) => {
        const muted = index === 0 && stepRef.current >= 3
        drawNode(node, hiddenPoints[index], Math.max(13, Math.min(24, width * 0.027)), stepRef.current >= 1, muted)
      })
      drawNode(networkNodes.output, outputPoint, Math.max(21, Math.min(39, width * 0.045)), stepRef.current >= 5)

      context.save()
      context.fillStyle = 'rgba(149, 172, 199, 0.76)'
      context.font = '9px "Cascadia Code", Consolas, monospace'
      context.textAlign = 'center'
      context.fillText('INPUT', width * 0.13, height * 0.88)
      context.fillText('HIDDEN', width * 0.49, height * 0.93)
      context.fillText('OUTPUT', width * 0.84, height * 0.88)
      context.restore()
    }

    const drawRoute = (time) => {
      const points = shipStops.map(point)
      context.save()
      context.setLineDash([4, 7])
      context.lineDashOffset = reducedMotion ? 0 : -time / 48
      context.strokeStyle = 'rgba(98, 230, 226, 0.24)'
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(points[0].x, points[0].y)
      points.slice(1).forEach((routePoint) => context.lineTo(routePoint.x, routePoint.y))
      context.stroke()
      context.restore()

      points.forEach((routePoint, index) => {
        const current = index === stepRef.current
        const done = index < stepRef.current
        context.save()
        context.fillStyle = current ? '#62e6e2' : done ? '#84a7ff' : 'rgba(146, 169, 195, 0.34)'
        if (current) {
          context.shadowColor = '#62e6e2'
          context.shadowBlur = 12
        }
        context.beginPath()
        context.arc(routePoint.x, routePoint.y, current ? 4.5 : 2.5, 0, Math.PI * 2)
        context.fill()
        context.restore()
      })
    }

    const drawShip = (time) => {
      const ship = shipRef.current
      const x = ship.x * width
      const y = ship.y * height
      const stopIndex = Math.max(0, stepRef.current)
      const previous = shipStops[Math.max(0, stopIndex - 1)]
      const current = shipStops[stopIndex]
      const angle = Math.atan2((current.y - previous.y) * height, (current.x - previous.x) * width)

      context.save()
      context.translate(x, y)
      context.rotate(Number.isFinite(angle) ? angle : 0)
      context.shadowColor = '#62e6e2'
      context.shadowBlur = 16
      context.fillStyle = '#62e6e2'
      context.beginPath()
      context.moveTo(13, 0)
      context.lineTo(-8, 6)
      context.lineTo(-4, 0)
      context.lineTo(-8, -6)
      context.closePath()
      context.fill()

      if (!reducedMotion && stepRef.current >= 0) {
        context.fillStyle = 'rgba(132, 167, 255, 0.6)'
        context.beginPath()
        context.moveTo(-8, -4)
        context.lineTo(-23 - Math.sin(time / 80) * 5, 0)
        context.lineTo(-8, 4)
        context.closePath()
        context.fill()
      }
      context.restore()
    }

    const render = (time) => {
      const delta = Math.min(0.04, (time - lastTime) / 1000)
      lastTime = time
      if (!isVisible || document.hidden) {
        frameId = window.requestAnimationFrame(render)
        return
      }
      const target = targetRef.current
      const ease = reducedMotion ? 1 : 1 - Math.pow(0.0002, delta)
      shipRef.current.x += (target.x - shipRef.current.x) * ease
      shipRef.current.y += (target.y - shipRef.current.y) * ease

      drawBackground(time)
      drawRoute(time)
      drawNetwork(time)
      drawShip(time)
      frameId = window.requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { rootMargin: '260px 0px' },
    )
    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    resize()
    frameId = window.requestAnimationFrame(render)

    return () => {
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="mlp-canvas"
      role="img"
      aria-label="MLP 神经网络飞行示意图。两个输入节点连接三个隐藏节点，三个隐藏节点再连接一个输出节点。"
    />
  )
}

function MlpLab() {
  const [step, setStep] = useState(-1)
  const [isAuto, setIsAuto] = useState(false)
  const station = stations[step]
  const completed = step === stations.length - 1

  useEffect(() => {
    if (!isAuto) return undefined
    const timer = window.setTimeout(() => {
      if (step >= stations.length - 1) {
        setIsAuto(false)
        return
      }
      setStep(step + 1)
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [isAuto, step])

  const goTo = (nextStep) => {
    setStep(Math.max(-1, Math.min(stations.length - 1, nextStep)))
  }

  const previous = () => {
    setIsAuto(false)
    goTo(Math.max(0, step - 1))
  }

  const next = () => {
    setIsAuto(false)
    goTo(step >= stations.length - 1 ? 0 : step + 1)
  }

  const toggleAuto = () => {
    if (isAuto) {
      setIsAuto(false)
      return
    }
    if (step >= stations.length - 1) goTo(0)
    setIsAuto(true)
  }

  return (
    <section className="mlp-section" id="mlp-lab">
      <div className="mlp-ambient" aria-hidden="true" />
      <div className="mlp-grid-bg" aria-hidden="true" />
      <div className="section mlp-shell">
        <div className="mlp-heading">
          <div className="mlp-heading-title reveal-item">
            <div className="section-kicker light"><span>04</span> PART 02 / MLP FLIGHT LAB</div>
            <h2>让一个决定，<br /><em>穿过神经网络。</em></h2>
          </div>
          <div className="mlp-heading-copy reveal-item">
            <p>
              一次 MLP 推理，像一架货舱装满数字的飞船。它会经过输入、加权、偏置、
              激活与输出，逐站把原始信号变成可解释的判断。
            </p>
            <div className="mlp-badges" aria-label="模型信息">
              <span>2 → 3 → 1</span>
              <span>FORWARD PASS</span>
              <span>1 INTERACTIVE LAB</span>
            </div>
          </div>
        </div>

        <div className="mlp-cockpit reveal-item">
          <div className="mlp-stage">
            <div className="mlp-stage-hud">
              <div>
                <span>MISSION</span>
                <strong>前向传播</strong>
              </div>
              <div>
                <span>{step < 0 ? '00' : String(step + 1).padStart(2, '0')} / 07</span>
                <strong>{completed ? '68.5%' : step < 0 ? '待机' : `第 ${step + 1} 站`}</strong>
              </div>
            </div>
            <MlpCanvas step={step} />
            <div className="mlp-controls" aria-label="MLP 演示控制">
              <button type="button" onClick={() => { setIsAuto(false); goTo(-1) }} aria-label="回到起点">↺</button>
              <button type="button" onClick={previous} disabled={step <= 0} aria-label="上一站">←</button>
              <button className="mlp-control-primary" type="button" onClick={next}>
                {completed ? '重新演示' : step < 0 ? '开始演示' : '下一站'} <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className={isAuto ? 'is-active' : ''}
                aria-pressed={isAuto}
                onClick={toggleAuto}
              >
                {isAuto ? '暂停巡航' : '自动巡航'}
              </button>
            </div>
          </div>

          <aside className="mlp-telemetry" aria-live="polite">
            <div className="mlp-telemetry-top">
              <span>STATION {step < 0 ? '00' : String(step + 1).padStart(2, '0')}</span>
              <span>{station?.tag ?? 'READY'}</span>
            </div>
            <p className="mlp-telemetry-label">当前检查点</p>
            <h3>{station?.title ?? '等待装载输入'}</h3>
            <p className="mlp-summary">
              {station?.summary ?? '当前样本有两个特征。点击“开始演示”，看它们怎样变成隐藏层的输入信号。'}
            </p>
            <div className="mlp-formula">
              <span>运算</span>
              <code>{station?.formula ?? 'x = [0.80, 0.60]'}</code>
            </div>
            <dl className="mlp-values">
              <div><dt>专注度 x₁</dt><dd>0.80</dd></div>
              <div><dt>紧迫度 x₂</dt><dd>0.60</dd></div>
              <div><dt>Logit</dt><dd>{step >= 5 ? '0.778' : '—'}</dd></div>
              <div><dt>输出 ŷ</dt><dd>{step >= 6 ? '68.5%' : '—'}</dd></div>
            </dl>
            <div className="mlp-progress" aria-label="七站进度">
              {stations.map((item, index) => (
                <button
                  key={item.tag}
                  type="button"
                  aria-label={`跳到第 ${index + 1} 站：${item.title}`}
                  aria-current={index === step ? 'step' : undefined}
                  className={index === step ? 'is-current' : index < step ? 'is-done' : ''}
                  onClick={() => { setIsAuto(false); goTo(index) }}
                />
              ))}
            </div>
          </aside>
        </div>

        <div className="mlp-route-heading reveal-item">
          <div>
            <span>THE ROUTE</span>
            <h3>七个计算站点</h3>
          </div>
          <p>每张卡片都是同一组数据的一次变换。点击任意一站，驾驶舱会同步跳转到对应计算。</p>
        </div>

        <div className="mlp-route-grid">
          {stations.map((item, index) => (
            <button
              key={item.tag}
              type="button"
              className={`mlp-route-card reveal-item ${index === step ? 'is-active' : ''}`}
              onClick={() => { setIsAuto(false); goTo(index) }}
            >
              <span className="mlp-route-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="mlp-route-tag">{item.tag}</span>
              <strong>{item.title}</strong>
              <code>{item.formula.split('\n')[0]}</code>
            </button>
          ))}
        </div>

        <div className="mlp-model reveal-item">
          <div className="mlp-model-copy">
            <span>MODEL CARD / 2 → 3 → 1</span>
            <h3>这不是黑箱，<br />只是一串连续变换。</h3>
            <p>
              这里展示的是训练完成后的<strong>一次前向传播</strong>。权重和偏置已经给定，
              所以每一步都可以手算；真实网络会通过反向传播不断调整这些参数。
            </p>
          </div>
          <div className="mlp-table-wrap">
            <table>
              <caption>隐藏层参数与前向计算结果</caption>
              <thead>
                <tr>
                  <th scope="col">神经元</th>
                  <th scope="col">x₁ · w₁</th>
                  <th scope="col">x₂ · w₂</th>
                  <th scope="col">偏置</th>
                  <th scope="col">z</th>
                  <th scope="col">ReLU</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">h₁ 谨慎评估</th>
                  <td>0.80 × 0.60 = 0.48</td>
                  <td>0.60 × −1.40 = −0.84</td>
                  <td>−0.10</td>
                  <td className="is-negative">−0.46</td>
                  <td className="is-negative">0.00</td>
                </tr>
                <tr>
                  <th scope="row">h₂ 均衡判断</th>
                  <td>0.80 × 0.40 = 0.32</td>
                  <td>0.60 × 0.80 = 0.48</td>
                  <td>−0.20</td>
                  <td>0.60</td>
                  <td>0.60</td>
                </tr>
                <tr>
                  <th scope="row">h₃ 冲刺行动</th>
                  <td>0.80 × 0.90 = 0.72</td>
                  <td>0.60 × 1.10 = 0.66</td>
                  <td>−0.30</td>
                  <td>1.08</td>
                  <td>1.08</td>
                </tr>
              </tbody>
            </table>
            <div className="mlp-final">
              <span>OUTPUT</span>
              <code>z² = 0.778</code>
              <code>ŷ = σ(z²) = 68.5%</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MlpLab
