import{e,u as a,f as t,g as s,h as l,o,c as i,b as n,i as r,t as c,_ as v,j as f,p as u,k as d,F as m,l as p,r as h,m as k}from"./app.7b2aa302.js";const x=f("data-v-024e1674");u("data-v-024e1674");const y={key:0,class:"home-hero"},g={key:0,class:"figure"},b={key:1,id:"main-title",class:"title"},$={key:2,class:"description"};d();var _=e({expose:[],setup(e){const f=a(),u=t(),d=s((()=>u.value.heroImage||m.value||h.value||_.value)),m=s((()=>null!==u.value.heroText)),p=s((()=>u.value.heroText||f.value.title)),h=s((()=>null!==u.value.tagline)),k=s((()=>u.value.tagline||f.value.description)),_=s((()=>u.value.actionLink&&u.value.actionText)),I=s((()=>u.value.altActionLink&&u.value.altActionText));return x(((e,a)=>l(d)?(o(),i("header",y,[e.$frontmatter.heroImage?(o(),i("figure",g,[n("img",{class:"image",src:e.$withBase(e.$frontmatter.heroImage),alt:e.$frontmatter.heroAlt},null,8,["src","alt"])])):r("v-if",!0),l(m)?(o(),i("h1",b,c(l(p)),1)):r("v-if",!0),l(h)?(o(),i("p",$,c(l(k)),1)):r("v-if",!0),l(_)?(o(),i(v,{key:3,item:{link:l(u).actionLink,text:l(u).actionText},class:"action"},null,8,["item"])):r("v-if",!0),l(I)?(o(),i(v,{key:4,item:{link:l(u).altActionLink,text:l(u).altActionText},class:"action alt"},null,8,["item"])):r("v-if",!0)])):r("v-if",!0)))}});_.__scopeId="data-v-024e1674";const I=f("data-v-e5f225ce");u("data-v-e5f225ce");const T={key:0,class:"home-features"},A={class:"wrapper"},L={class:"container"},j={class:"features"},w={key:0,class:"title"},B={key:1,class:"details"};d();var C=e({expose:[],setup(e){const a=t(),v=s((()=>a.value.features&&a.value.features.length>0)),f=s((()=>a.value.features?a.value.features:[]));return I(((e,a)=>l(v)?(o(),i("div",T,[n("div",A,[n("div",L,[n("div",j,[(o(!0),i(m,null,p(l(f),((e,a)=>(o(),i("section",{key:a,class:"feature"},[e.title?(o(),i("h2",w,c(e.title),1)):r("v-if",!0),e.details?(o(),i("p",B,c(e.details),1)):r("v-if",!0)])))),128))])])])])):r("v-if",!0)))}});C.__scopeId="data-v-e5f225ce";const F={},q=f("data-v-df8b2502");u("data-v-df8b2502");const z={key:0,class:"footer"},D={class:"container"},E={class:"text"};d();const G=q(((e,a)=>e.$frontmatter.footer?(o(),i("footer",z,[n("div",D,[n("p",E,c(e.$frontmatter.footer),1)])])):r("v-if",!0)));F.render=G,F.__scopeId="data-v-df8b2502";const H=f("data-v-6e1bdf43");u("data-v-6e1bdf43");const J={class:"home","aria-labelledby":"main-title"},K={class:"home-content"};d();var M=e({expose:[],setup:e=>H(((e,a)=>{const t=h("Content");return o(),i("main",J,[n(_),k(e.$slots,"hero"),n(C),n("div",K,[n(t)]),k(e.$slots,"features"),n(F),k(e.$slots,"footer")])}))});M.__scopeId="data-v-6e1bdf43";export default M;