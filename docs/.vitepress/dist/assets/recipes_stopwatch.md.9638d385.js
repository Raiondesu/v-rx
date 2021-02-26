import{r as n,o as a,c as s,b as t,w as p,a as e}from"./app.159c6ae7.js";const o='{"title":"Stopwatch","description":"","frontmatter":{},"headers":[{"level":2,"title":"Step-by-step","slug":"step-by-step"},{"level":3,"title":"Basics","slug":"basics"},{"level":3,"title":"Reducers and counting logic","slug":"reducers-and-counting-logic"},{"level":3,"title":"Component","slug":"component"}],"relativePath":"recipes/stopwatch.md","lastUpdated":1614340406189}',c={},u=e('<h1 id="stopwatch"><a class="header-anchor" href="#stopwatch" aria-hidden="true">#</a> Stopwatch</h1><p><div class="table-of-contents"><ul><li><a href="#step-by-step">Step-by-step</a><ul><li><a href="#basics">Basics</a></li><li><a href="#reducers-and-counting-logic">Reducers and counting logic</a></li><li><a href="#component">Component</a></li></ul></li></ul></div></p><p>This is a simple stopwatch with configurable increment step, interval and maximum value limit.</p>',3),l=e('<p>The full source can be found <a href="https://github.com/Raiondesu/vuse-rx/blob/main/docs/.vitepress/theme/recipes/stopwatch.vue" target="_blank" rel="noopener noreferrer">here</a>.</p><h2 id="step-by-step"><a class="header-anchor" href="#step-by-step" aria-hidden="true">#</a> Step-by-step</h2><h3 id="basics"><a class="header-anchor" href="#basics" aria-hidden="true">#</a> Basics</h3><p>First, let&#39;s define some basic reactive state for our stopwatch:</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useRxState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vuse-rx&#39;</span><span class="token punctuation">;</span>\n\n<span class="token comment">// useRxState accepts an initial state for the system.</span>\n<span class="token comment">// Let&#39;s pass a factory into it,</span>\n<span class="token comment">// so that it can create a new state for each stopwatch instance</span>\n<span class="token keyword">const</span> createStopwatch <span class="token operator">=</span> <span class="token function">useRxState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token comment">// Determines if the stopwatch is counting</span>\n  count<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n\n  <span class="token comment">// The smaller the speed,</span>\n  <span class="token comment">// the bigger the interval between increments</span>\n  speed<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>\n\n  <span class="token comment">// Actual stopwatch counter</span>\n  value<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n\n  <span class="token comment">// Maximum counter value, NaN means unlimited</span>\n  maxValue<span class="token operator">:</span> <span class="token number">NaN</span><span class="token punctuation">,</span>\n\n  <span class="token comment">// Step of the increment</span>\n  step<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>And some &quot;business-rules&quot;:</p><div class="language-js"><pre><code><span class="token comment">// A small utility to calculate the delay between increments</span>\n<span class="token keyword">const</span> <span class="token function-variable function">calcDelay</span> <span class="token operator">=</span> <span class="token parameter">state</span> <span class="token operator">=&gt;</span> <span class="token number">1000</span> <span class="token operator">/</span> state<span class="token punctuation">.</span>speed<span class="token punctuation">;</span>\n\n<span class="token comment">// Stopwatch is paused if it&#39;s not counting,</span>\n<span class="token keyword">const</span> <span class="token function-variable function">paused</span> <span class="token operator">=</span> <span class="token parameter">state</span> <span class="token operator">=&gt;</span> <span class="token operator">!</span>state<span class="token punctuation">.</span>count <span class="token operator">||</span> state<span class="token punctuation">.</span>step <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">||</span> <span class="token punctuation">(</span>\n  <span class="token comment">// or if the value has reached the maximum limit</span>\n  state<span class="token punctuation">.</span>step <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> state<span class="token punctuation">.</span>value <span class="token operator">&gt;=</span> state<span class="token punctuation">.</span>maxValue\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// Value must be capped by the maxValue</span>\n<span class="token keyword">const</span> <span class="token function-variable function">clampValue</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">maxValue<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>\n  maxValue<span class="token punctuation">,</span>\n  value<span class="token operator">:</span> value <span class="token operator">&gt;</span> maxValue <span class="token operator">?</span> maxValue <span class="token operator">:</span> value\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><h3 id="reducers-and-counting-logic"><a class="header-anchor" href="#reducers-and-counting-logic" aria-hidden="true">#</a> Reducers and counting logic</h3><p>The next step would be to define reducers for our state. These reducers contain atomic, pure state updates, that are necessary for our business-logic to work.</p><p>Each reducer must return either a part of the state, or an observable that emits a part of the state.</p><div class="language-js"><pre><code><span class="token comment">// It&#39;s handy to wrap everything into a neat vue hook</span>\n<span class="token comment">// which encapsulates the whole functionality</span>\n<span class="token keyword">const</span> <span class="token function-variable function">useStopwatch</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">createStopwatch</span><span class="token punctuation">(</span>\n  <span class="token comment">// Reducers</span>\n  <span class="token punctuation">{</span>\n    <span class="token comment">// Play/Pause functionality</span>\n    <span class="token function-variable function">setCountState</span><span class="token operator">:</span> <span class="token parameter">play</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> play <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n    <span class="token function-variable function">setStep</span><span class="token operator">:</span> <span class="token parameter">step</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> step <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n    <span class="token comment">// Speed must be greater than zero</span>\n    <span class="token function-variable function">setSpeed</span><span class="token operator">:</span> <span class="token parameter">speed</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> speed<span class="token operator">:</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> speed<span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n    <span class="token comment">// Increment is done by steps, but the value cannot be incremented above the maximum</span>\n    <span class="token function-variable function">increment</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token parameter">state</span> <span class="token operator">=&gt;</span> <span class="token function">clampValue</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>maxValue<span class="token punctuation">,</span> state<span class="token punctuation">.</span>value <span class="token operator">+</span> state<span class="token punctuation">.</span>step<span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n    <span class="token comment">// Setting the value is limited by the maxValue</span>\n    <span class="token function-variable function">setValue</span><span class="token operator">:</span> <span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token parameter">state</span> <span class="token operator">=&gt;</span> <span class="token function">clampValue</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>maxValue<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n    <span class="token comment">// When setting the maxValue, we should also re-set the counter value,</span>\n    <span class="token comment">// in case it&#39;s above the new maximum</span>\n    <span class="token function-variable function">setMaxValue</span><span class="token operator">:</span> <span class="token parameter">max</span> <span class="token operator">=&gt;</span> <span class="token parameter">state</span> <span class="token operator">=&gt;</span> <span class="token function">clampValue</span><span class="token punctuation">(</span>max<span class="token punctuation">,</span> state<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\n  <span class="token comment">// Here we modify the resulting observable</span>\n  <span class="token comment">// by applying some of the reducers from above</span>\n  <span class="token punctuation">(</span><span class="token parameter">state$<span class="token punctuation">,</span> <span class="token punctuation">{</span> increment <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> state$<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>\n    <span class="token function">switchMap</span><span class="token punctuation">(</span><span class="token parameter">state</span> <span class="token operator">=&gt;</span>\n      <span class="token function">paused</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span>\n        <span class="token comment">// if stopwatch is paused, proceed with no changes</span>\n        <span class="token operator">?</span> <span class="token keyword">of</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span>\n        <span class="token comment">// otherwise - create a timer</span>\n        <span class="token operator">:</span> <span class="token function">interval</span><span class="token punctuation">(</span><span class="token function">calcDelay</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>\n            <span class="token function">mapTo</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">,</span>\n            <span class="token comment">// that increments the state on each tick</span>\n            <span class="token function">map</span><span class="token punctuation">(</span><span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n          <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><h3 id="component"><a class="header-anchor" href="#component" aria-hidden="true">#</a> Component</h3><p>Now that we have defined the inner workings of the stopwatch, let&#39;s define how it&#39;s displayed to the user.</p><h4 id="setup-function"><a class="header-anchor" href="#setup-function" aria-hidden="true">#</a> <code>setup</code> function</h4><div class="language-vue"><div class="highlight-lines"><br><br><br><br><div class="highlighted"> </div><br><br><br><div class="highlighted"> </div><div class="highlighted"> </div><div class="highlighted"> </div><div class="highlighted"> </div><br><br><br><br><br><br><br><br><div class="highlighted"> </div><div class="highlighted"> </div><br><br><br><br><br><br><br><br></div><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token comment">// paste the code from earlier steps here</span>\n\n<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent<span class="token punctuation">,</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> syncRef <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vuse-rx&#39;</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Retrieve reducers and a fully reactive state</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> actions<span class="token punctuation">,</span> state <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useStopwatch</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token comment">// a shorthand to subscribe to our newly created observalble, neat!</span>\n      <span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token parameter">state</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;state updated: &#39;</span><span class="token punctuation">,</span> state<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">return</span> <span class="token punctuation">{</span>\n      <span class="token operator">...</span>actions<span class="token punctuation">,</span>\n      state<span class="token punctuation">,</span>\n      stepRef<span class="token operator">:</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token function">String</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>step<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      setToRef<span class="token operator">:</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token function">String</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      maxRef<span class="token operator">:</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token function">String</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>maxValue<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n      <span class="token comment">// update speedRef whenever the state.speed property changes</span>\n      speedRef<span class="token operator">:</span> <span class="token function">syncRef</span><span class="token punctuation">(</span>state<span class="token punctuation">,</span> <span class="token string">&#39;speed&#39;</span><span class="token punctuation">,</span> String<span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n      <span class="token comment">// override one of the actions to interpret empty string as NaN instead of 0</span>\n      <span class="token function-variable function">setMaxValue</span><span class="token operator">:</span> <span class="token parameter">maxRef</span> <span class="token operator">=&gt;</span> actions<span class="token punctuation">.</span><span class="token function">setMaxValue</span><span class="token punctuation">(</span>maxRef <span class="token operator">===</span> <span class="token string">&#39;&#39;</span> <span class="token operator">?</span> <span class="token number">NaN</span> <span class="token operator">:</span> <span class="token operator">+</span>maxRef<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><h4 id="template"><a class="header-anchor" href="#template" aria-hidden="true">#</a> <code>template</code></h4><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    <span class="token comment">&lt;!-- Just a neat way to display the reactive state --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>(value, key) in state<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>key<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{key}}: {{value}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    <span class="token comment">&lt;!-- Toggle counting state --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setCountState(!state.count)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{ state.count ? &#39;Pause&#39; : &#39;Start&#39; }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n\n    <span class="token comment">&lt;!-- Reset the counter value to 0 --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setValue(0)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Reset<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    <span class="token comment">&lt;!-- Toggle counting direction --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setStep(-state.step)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Count {{ state.step &gt; 0 ? &#39;down&#39; : &#39;up&#39; }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setToRef<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>\n    <span class="token comment">&lt;!-- Convert ref&#39;s value to string and set it as the counter&#39;s value --&gt;</span>\n    <span class="token comment">&lt;!-- using the reducer that was defined earlier --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setValue(+setToRef)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Set value<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    <span class="token comment">&lt;!-- Convert speedRef value to string and set it as the counter&#39;s speed --&gt;</span>\n    <span class="token comment">&lt;!-- using the reducer that was defined earlier --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>speedRef<span class="token punctuation">&quot;</span></span> <span class="token attr-name">@blur.capture</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setSpeed(+speedRef)<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>\n\n    <span class="token comment">&lt;!-- Shorthand buttons to increment or decrement speed --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setSpeed(+speedRef - 1)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>-<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setSpeed(+speedRef + 1)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>+<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n    <span class="token comment">&lt;!-- We don&#39;t need to assign the new speed to the ref --&gt;</span>\n    <span class="token comment">&lt;!-- because out speedRef is automatically synced to the reactive state.speed property! --&gt;</span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>stepRef<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setStep(+stepRef)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Set step<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    <span class="token comment">&lt;!-- Same thing as earlier, but for maxRef, --&gt;</span>\n    <span class="token comment">&lt;!-- with some workarounds to treat empty string as NaN --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>maxRef<span class="token punctuation">&quot;</span></span>\n      <span class="token attr-name">@keyup.enter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setMaxValue(maxRef)<span class="token punctuation">&quot;</span></span>\n      <span class="token attr-name">@focus.capture</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>isNaN(maxRef) &amp;&amp; (maxRef = <span class="token punctuation">&#39;</span><span class="token punctuation">&#39;</span>)<span class="token punctuation">&quot;</span></span>\n      <span class="token attr-name">@blur.capture</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>maxRef = maxRef === <span class="token punctuation">&#39;</span><span class="token punctuation">&#39;</span> || isNaN(maxRef) ? <span class="token punctuation">&#39;</span>NaN<span class="token punctuation">&#39;</span> : maxRef<span class="token punctuation">&quot;</span></span>\n    <span class="token punctuation">/&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>setMaxValue(maxRef)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Set maximum<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div>',17);c.render=function(e,o,c,i,k,r){const m=n("StopwatchDemo"),g=n("ClientOnly");return a(),s("div",null,[u,t(g,null,{default:p((()=>[t(m)])),_:1}),l])};export default c;export{o as __pageData};
