"use strict";

// 端末内で選択肢に応じた改善例を表示する。回答は保存・送信しない。
// 送信先を確認して設定すると、来場者のメールアプリで下書きを開ける。
// 展示専用の公開アドレス。基本アドレスは公開ファイルに含めない。
const CONTACT_EMAIL = "dx-expo2026@wistellart.com";
const industryProfiles = {
  "fishery": {
    "name": "漁業",
    "options": [
      [
        "records",
        "漁獲・操業記録を書き直す"
      ],
      [
        "sea",
        "海況情報をあちこち確認する"
      ],
      [
        "schedule",
        "水揚げ予定や変更を連絡する"
      ],
      [
        "knowledge",
        "作業のコツを後継者に伝える"
      ],
      [
        "discovery",
        "その他・まだ整理できていない"
      ]
    ]
  },
  "aquaculture": {
    "name": "養殖",
    "options": [
      [
        "records",
        "生育・作業記録をまとめる"
      ],
      [
        "sea",
        "水温・赤潮情報を確認する"
      ],
      [
        "schedule",
        "収穫・出荷予定を調整する"
      ],
      [
        "knowledge",
        "現場の手順を引き継ぐ"
      ],
      [
        "discovery",
        "その他・まだ整理できていない"
      ]
    ]
  },
  "processing": {
    "name": "水産加工",
    "options": [
      [
        "hygiene",
        "衛生記録を記入・確認する"
      ],
      [
        "lot",
        "原料や製品のロットを探す"
      ],
      [
        "orders",
        "注文から伝票・作業指示を作る"
      ],
      [
        "records",
        "製造日報・歩留まりをまとめる"
      ],
      [
        "knowledge",
        "新人に作業手順を説明する"
      ],
      [
        "discovery",
        "その他・まだ整理できていない"
      ]
    ]
  },
  "wholesale": {
    "name": "卸・市場",
    "options": [
      [
        "orders",
        "電話・FAXの注文を入力する"
      ],
      [
        "inventory",
        "魚種・規格ごとの在庫を確認する"
      ],
      [
        "shipping",
        "出荷の明細を何度も転記する"
      ],
      [
        "promotion",
        "商品案内・見積用の説明文を作る"
      ],
      [
        "discovery",
        "その他・まだ整理できていない"
      ]
    ]
  },
  "sales": {
    "name": "小売・販売",
    "options": [
      [
        "inventory",
        "在庫や売れ残りを確認する"
      ],
      [
        "promotion",
        "商品紹介やSNSを書く"
      ],
      [
        "records",
        "売上・販売日報をまとめる"
      ],
      [
        "hygiene",
        "温度・清掃記録を記入・確認する"
      ],
      [
        "discovery",
        "その他・まだ整理できていない"
      ]
    ]
  },
  "logistics": {
    "name": "冷蔵・物流",
    "options": [
      [
        "inventory",
        "荷物の場所・数量を探す"
      ],
      [
        "shipping",
        "入出庫・配送情報を転記する"
      ],
      [
        "hygiene",
        "温度記録や異常時の報告をまとめる"
      ],
      [
        "lot",
        "預かった荷物の履歴を探す"
      ],
      [
        "knowledge",
        "現場の手順を引き継ぐ"
      ],
      [
        "discovery",
        "その他・まだ整理できていない"
      ]
    ]
  },
  "support": {
    "name": "漁協・行政・支援",
    "options": [
      [
        "application",
        "申請の記入漏れを確認する"
      ],
      [
        "records",
        "事業者の報告を集めて集計する"
      ],
      [
        "knowledge",
        "同じ問い合わせに繰り返し答える"
      ],
      [
        "promotion",
        "特産品の情報を複数媒体向けに整える"
      ],
      [
        "discovery",
        "その他・まだ整理できていない"
      ]
    ]
  },
  "other": {
    "name": "その他",
    "options": [
      [
        "orders",
        "注文・伝票を入力する"
      ],
      [
        "records",
        "日報・報告書を作る"
      ],
      [
        "knowledge",
        "手順を引き継ぐ"
      ],
      [
        "promotion",
        "商品・サービスを紹介する"
      ],
      [
        "discovery",
        "その他・まだ整理できていない"
      ]
    ]
  }
};
const steps = [
  {key:"sector",title:"どの分野のお仕事ですか？",help:"近いものを1つ選んでください。",options:[
    ["fishery", "漁業"], ["aquaculture", "養殖"], ["processing", "水産加工"], ["wholesale", "卸・市場"], ["sales", "小売・販売"], ["logistics", "冷蔵・物流"], ["support", "漁協・行政・支援"], ["other", "その他"]]},
  {key:"task",title:"毎日の仕事で、いちばん負担に感じるのは？",help:"毎日の仕事で思い浮かぶものを1つ選んでください。",options:[
    ["orders","注文・伝票の入力や転記"],["inventory","在庫・出荷・配送の確認"],["reports","日報・衛生記録・報告書"],["handover","引き継ぎ・新人への説明"],["promotion","商品紹介・営業資料・SNS"],["other","その他・まだ整理できていない"]]},
  {key:"frequency",title:"その仕事は、どのくらい発生しますか？",help:"おおよそで構いません。",options:[
    ["daily","ほぼ毎日"],["weekly","週に数回"],["monthly","月に数回"],["seasonal","繁忙期に集中する"]]},
  {key:"method",title:"今は主に何を使っていますか？",help:"中心になっている方法を1つ選んでください。",options:[
    ["paper","紙・手書き"],["phone","電話・FAX"],["sheet","Excel・表計算"],["software","業務ソフト"],["mixed","複数の方法を併用"]]},
  {key:"pain",title:"特に困るのはどんな点ですか？",help:"一番近いものを1つ選んでください。",options:[
    ["time","時間がかかる"],["errors","入力ミス・確認漏れ"],["duplicate","同じ情報を何度も入力する"],["knowledge","担当者にしか分からない"],["search","必要な情報を探しにくい"]]}
];

const ideas = {
  orders:{title:"注文・伝票の流れを整える",body:"注文を受けてから記録・確認するまでの手順を揃えると、転記や確認の手間を減らせる可能性があります。紙やFAXが中心なら、読み取り補助も候補です。",first:"直近の注文を1件選び、受け取りから確定まで何回書き写すかを数えてみましょう。",caution:"数量・金額・納期など、間違えると影響が大きい項目は人が確認できる形を残しましょう。"},
  inventory:{title:"在庫・出荷情報の見える場所を一つに",body:"誰が、いつ、どの情報を更新するかを整理し、確認先を揃えることが第一歩です。更新の通知や集計の補助も検討できます。",first:"在庫や出荷状況を確認する際、参照する紙・表・システムを一覧にしましょう。",caution:"鮮度やロットなど現場固有の管理項目と、入力しやすさを一緒に確認しましょう。"},
  reports:{title:"記録と報告書づくりを軽くする",body:"毎回同じ内容を書く部分を選択式にし、記録済みの事実から報告文の下書きを作る方法が考えられます。",first:"最近の記録を3件見比べ、共通項目と毎回変わる項目を分けましょう。",caution:"衛生・品質に関わる記録は、日時や担当者などの事実を人が確認できるようにしましょう。"},
  handover:{title:"現場の手順を探しやすくする",body:"ベテランへの質問を集め、短い手順書や写真付きの説明に整理することが考えられます。必要な手順を検索する仕組みも候補です。",first:"新人からよく聞かれる質問を5つ書き出し、答えが現在どこにあるか確認しましょう。",caution:"安全や品質に関わる判断は、責任者の確認手順を明確にしましょう。"},
  promotion:{title:"発信に使う情報を整理する",body:"商品情報・写真・表現のルールをまとめると、営業資料やSNSの文章案を作りやすくなります。AIは下書き作成の補助に使えます。",first:"よく使う商品情報と、公開前に確認すべき項目を一枚に整理しましょう。",caution:"産地、価格、効能などの表記は、公開前に担当者が事実を確認しましょう。"},
  other:{title:"困りごとの流れを見える化する",body:"改善する仕事を一つ選び、開始から完了までの作業と受け渡しを並べてみましょう。手順が分かると、AIや仕組みで補助できる部分を検討できます。",first:"今週もっとも手間がかかった仕事を一つ選び、誰が何をしたかを順番に書きましょう。",caution:"AIの利用を決める前に、手順の整理だけで解決できる部分も確認しましょう。"}
};

const automations = {
  orders:["入力の重複を減らす","注文情報を一度入力し、確認や伝票作成に使い回す方法が考えられます。紙・FAXが中心なら、読み取りで下書きを作る方法も候補です。"],
  inventory:["状況確認を一か所にまとめる","在庫や出荷の更新を一つの記録に集め、必要な人が同じ情報を見られるようにする方法が考えられます。"],
  reports:["記録から報告の下書きを作る","日々の記録を定型項目に整理し、集計や報告文の下書きにつなげる方法が考えられます。"],
  handover:["よく聞かれることをすぐ探せるようにする","手順や判断の根拠を短く記録し、必要なときに探せる形へ整える方法が考えられます。"],
  promotion:["素材から発信案を作る","確認済みの商品情報や写真をもとに、営業資料・SNS投稿文の下書きを作る方法が考えられます。"],
  other:["繰り返し作業を見つける","作業の手順が見えたら、同じ入力・転記・確認を繰り返している箇所から小さく改善できます。"]
};
const methodInsights = {
  paper:"紙・手書きで扱う情報を、後で入力し直していないか確認すると改善箇所が見つかりやすくなります。",
  phone:"電話・FAXで受けた内容を、誰がいつ確定するかを揃えると確認漏れを減らせる可能性があります。",
  sheet:"Excel・表計算の入力欄や更新担当を揃えると、集計や転記の手間を見直しやすくなります。",
  software:"今の業務ソフトと周辺の作業のつながりを見ると、二重入力や確認の手間が見つかるかもしれません。",
  mixed:"複数の方法を併用している場合、情報がどこで移り変わるかを追うと改善箇所を見つけやすくなります。"
};
const painInsights = {
  time:"特に時間がかかる工程を一つ選び、前後の作業も含めて見直すことが有効です。",
  errors:"確認が必要な項目を明確にし、入力の補助と人の最終確認を組み合わせる方法が考えられます。",
  duplicate:"同じ情報を何度も入力している場所が、最初に見直す候補です。",
  knowledge:"特定の担当者だけが知る手順を残すことが、改善の出発点になります。",
  search:"情報の置き場所や名前の付け方を揃えると、探す時間を減らせる可能性があります。"
};

const $ = id => document.getElementById(id);
let current = 0;
let answers = {};

function stepFor(key){
 const step=steps.find(s=>s.key===key);
 if(key==='task')return {...step,help:`${industryProfiles[answers.sector]?.name||'お仕事'}で近いものを1つ選んでください。`,options:(industryProfiles[answers.sector]||industryProfiles.other).options};
 if(key==='frequency'||key==='method'||key==='pain')return {...step,help:`「${label('task',answers.task)}」について教えてください。`};
 return step;
}
function label(key,value){return stepFor(key).options.find(o=>o[0]===value)?.[1] || "";}
function showStep(){
  const step=stepFor(steps[current].key);
  $("step-count").textContent=`${current+1}/${steps.length}`;
  $("progress-fill").style.width=`${((current+1)/steps.length)*100}%`;
  $("form-title").textContent=step.title;
  $("step-help").textContent=step.help;
  $("choices").replaceChildren();
  step.options.forEach(([value,text])=>{
    const item=document.createElement("label");item.className="choice";
    const input=document.createElement("input");input.type="radio";input.name=step.key;input.value=value;input.checked=answers[step.key]===value;
    input.addEventListener("change",()=>{if(answers[step.key]!==value && (step.key==='sector'||step.key==='task')){steps.slice(current+1).forEach(s=>delete answers[s.key]);}answers[step.key]=value;$("next").disabled=false;});
    const span=document.createElement("span");span.textContent=text;item.append(input,span);$("choices").append(item);
  });
  $("back").hidden=current===0;
  $("next").disabled=!answers[step.key];
  $("next").innerHTML=current===steps.length-1?"結果を見る <span aria-hidden=\"true\">→</span>":"次へ <span aria-hidden=\"true\">→</span>";
  $("form-panel").classList.remove("step-enter"); void $("form-panel").offsetWidth; $("form-panel").classList.add("step-enter");
  window.scrollTo({top:0,behavior:"instant"});
}
function sentenceLines(text){return text.replace(/。(?=\S)/g,"。\n");}
function showResult(){
  $("form-panel").classList.add("hidden");$("result").classList.remove("hidden");
  const plan=buildPlan();
  $("report-title").textContent=plan.title;
  $("result-benefit").textContent=sentenceLines(plan.benefit);
  $("solution-flow").textContent=sentenceLines(plan.flow);
  $("human-check").textContent=sentenceLines(plan.check);
  $("result-character").src=`character-${plan.character||"discovery"}.png`;
  $("result-character").alt=`${plan.title}の案内キャラクター`;
  $("email-result").disabled=!CONTACT_EMAIL;
  $("share-status").textContent=CONTACT_EMAIL ? "" : "送信先メールアドレスを準備中です。";
  updatePreview();
  $("result").scrollIntoView({behavior:"instant"});
}
function validationHint(){
  const metric={time:"所要時間",errors:"修正や確認漏れの件数",duplicate:"同じ情報の入力回数",knowledge:"担当者への確認回数",search:"情報を探す時間"}[answers.pain];
  const period=answers.frequency==="seasonal"?"繁忙期の代表的な作業を想定し、通常期との違いも整理して": "同じ条件の作業を数件選び";
  return `${period}、改善前後の${metric}を比べると、役立つ改善か判断しやすくなります。`;
}
function mailBody(){return resultText()+"\n\nこの診断結果をもとに、業務改善について相談を希望します。";}
function updatePreview(){ $("mail-preview").textContent=mailBody(); }
function validateConsultation(){
 const name=$("company").value.trim();
 if(!name){$("company-error").textContent="相談する企業名・屋号をご入力ください。";$("company").focus();return false;}
 $("company-error").textContent="";
 return true;
}
$("company").addEventListener("input",()=>{updatePreview();});
$("recipient").textContent=CONTACT_EMAIL;
$("consult-open").classList.toggle("hidden",!CONTACT_EMAIL);
function resultText(){
 const plan=buildPlan();
 return ["AI業務改善・簡易診断｜Wistellart",`企業名：${$("company").value.trim()||"未入力"}`,"", "【提案されたシステム】",plan.title,plan.benefit,plan.flow,plan.check,"", "【相談の参考：回答内容】",...steps.map(s=>`${s.title} ${label(s.key,answers[s.key])}`),"", "実現方法と効果は業務を確認して判断します。"].join("\n");
}
$("email-result").addEventListener("click",()=>{
  if(!CONTACT_EMAIL || !validateConsultation())return;
  updatePreview();
  $("consent-dialog").showModal();
});
$("consent-no").addEventListener("click",()=>$("consent-dialog").close());
$("consent-dialog").addEventListener("close",()=>$("email-result").focus());
$("consent-yes").addEventListener("click",()=>{
  if(!$("consent-dialog").open || !CONTACT_EMAIL || !validateConsultation())return;
  $("consent-dialog").close();
  const subject=encodeURIComponent("AI業務改善の相談 / "+$("company").value.trim());
  const body=encodeURIComponent(mailBody());
  $("share-status").textContent="メールアプリで送信を完了してください。開かない場合は、下の案内をご確認ください。";
  window.location.href=`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});
$("start").addEventListener("click",()=>{chime();$("intro").classList.add("hidden");$("about").classList.add("hidden");$("form-panel").classList.remove("hidden");showStep();});
$("next").addEventListener("click",()=>{if(!answers[steps[current].key])return;chime("next");if(current<steps.length-1){current++;showStep();}else{showTreasure();}});
$("back").addEventListener("click",()=>{if(current>0){chime("back");current--;showStep();}});
$("restart").addEventListener("click",()=>{answers={};current=0;$("company").value="";$("consent-dialog").close();$("share-status").textContent="";$("mail-preview").textContent="";$("company-error").textContent="";$("preview").open=false;$("consult-panel").classList.add("hidden");$("result").classList.add("hidden");$("intro").classList.remove("hidden");$("about").classList.remove("hidden");window.scrollTo({top:0,behavior:"instant"});});

let soundOn=true, audioContext;
async function chime(complete=false){
 if(!soundOn)return;
 try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('unsupported');audioContext ||= new Audio();await audioContext.resume();if(audioContext.state!=='running')throw Error('suspended');const now=audioContext.currentTime+.025;for(const [i,f] of (complete==="back"?[1046.5,880,783.99,659.25,523.25]:complete==="next"?[523.25,659.25,783.99,880,1046.5]:complete===true?[523.25,659.25,783.99]:[660]).entries()){const o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,now+i*.1);g.gain.linearRampToValueAtTime(.035,now+i*.1+.015);g.gain.exponentialRampToValueAtTime(.001,now+i*.1+.2);o.start(now+i*.1);o.stop(now+i*.1+.22);}}catch{ $('sound-toggle').textContent='音 再試行';$('sound-toggle').setAttribute('aria-label','音声を再試行。端末の音量と消音設定もご確認ください。');soundOn=false;}
}
$('sound-toggle').addEventListener('click',()=>{soundOn=!soundOn;$('sound-toggle').textContent=soundOn?'音 ON':'音 OFF';$('sound-toggle').setAttribute('aria-pressed',String(soundOn));chime();});
document.addEventListener('change',e=>{if(e.target.matches('input[type="radio"]'))chime();});
function showTreasure(){ $('form-panel').classList.add('hidden');$('treasure').classList.remove('hidden','opened');$('open-treasure').disabled=false;$('treasure-title').focus();window.scrollTo({top:0,behavior:'instant'}); }
$('open-treasure').addEventListener('click',()=>{ $('open-treasure').disabled=true;$('treasure').classList.add('opened');chime(true);setTimeout(()=>{$('treasure').classList.add('hidden');showResult();$('report-title').setAttribute('tabindex','-1');$('report-title').focus();},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:850);});

const systemPlans={
  "records": {
    "title": "AI記録・報告サポート",
    "flow": "記録を取り込む → AIが要点を整理 → 日報・報告書の下書きに",
    "check": "元の記録と下書きは担当者が確認します。",
    "character": "records"
  },
  "sea": {
    "title": "AI海況情報サポート",
    "flow": "利用できる海況情報を集める → AIが要点を整理 → 出典・更新日時と一緒に表示",
    "check": "情報源との連携が前提です。出漁・養殖の安全判断は人が行います。",
    "character": "sea"
  },
  "schedule": {
    "title": "AI予定・連絡サポート",
    "flow": "予定・実績をまとめる → 変更点を整理 → 関係者への連絡文を下書き",
    "check": "予定と連絡先を確認し、人が承認してから送信します。",
    "character": "schedule"
  },
  "hygiene": {
    "title": "AI衛生記録サポート",
    "flow": "衛生記録を取り込む → 確認が必要な箇所を一覧に → 報告書の下書きに",
    "check": "衛生判断・承認は人が行います。温度の自動取得にはセンサー連携が必要です。",
    "character": "hygiene"
  },
  "lot": {
    "title": "AIロット検索サポート",
    "flow": "原料・製品の記録をつなぐ → AIが対象ロットを検索 → 関連する履歴を表示",
    "check": "ロットを結びつけた記録が前提です。追跡結果と品質判断は人が確認します。",
    "character": "lot"
  },
  "orders": {
    "title": "AI受注・伝票サポート",
    "flow": "注文を読み取る → 魚種・規格・数量を入力候補に → 確認後に伝票へ反映",
    "check": "数量・重量単位・単価・納期は人が確定します。既存ソフトとの連携は要確認です。",
    "character": "orders"
  },
  "inventory": {
    "title": "AI在庫照会サポート",
    "flow": "在庫記録を参照 → AIが質問に合う情報を検索 → 数量・場所・更新日時を表示",
    "check": "在庫記録の更新が前提です。販売・出荷可能数は人が確認します。",
    "character": "inventory"
  },
  "shipping": {
    "title": "AI入出庫・出荷サポート",
    "flow": "入出庫情報を取り込む → 転記と照合を補助 → 出荷・配送用の一覧に",
    "check": "ロット・数量・届け先は人が確認します。倉庫・配送システムとの連携は要確認です。",
    "character": "shipping"
  },
  "promotion": {
    "title": "AI商品紹介サポート",
    "flow": "確認済みの商品情報をまとめる → AIが文章を下書き → SNS・営業資料向けに整える",
    "check": "産地・価格・アレルゲンなどの事実と表現は、人が確認してから公開します。",
    "character": "promotion"
  },
  "knowledge": {
    "title": "AI現場ナレッジサポート",
    "flow": "手順書・FAQを登録 → AIが質問に合う記述を検索 → 出典付きで案内",
    "check": "根拠がない質問には回答を控えます。安全・制度の判断は担当者へつなぎます。",
    "character": "knowledge"
  },
  "application": {
    "title": "AI申請・集計サポート",
    "flow": "申請・報告を取り込む → 必須項目の不足を検出 → AIが要点と確認依頼文を下書き",
    "check": "受付・審査の判断と連絡の送信は人が行います。個人情報の扱いを先に設計します。",
    "character": "application"
  },
  "discovery": {
    "title": "AI業務整理サポート",
    "flow": "繰り返す作業を一つ選ぶ → AIが補助する仕組みを試作 → 現場で効果を確認",
    "check": "対象業務を伺い、AIと通常の自動化のどちらが適するか見極めます。",
    "character": "discovery"
  }
};
function buildPlan(){
 const base=systemPlans[answers.task]||systemPlans.discovery;
 const outcomes={time:'下書きや情報整理を任せて、作業時間を減らすことを目指します。',errors:'入力候補と確認ポイントを示し、見落としを減らすことを目指します。',duplicate:'一度取り込んだ情報を使い回し、二重入力を減らす設計を検討できます。',knowledge:'手順と情報を共有し、担当者への確認の集中を減らす設計を検討できます。',search:'必要な情報を根拠付きで探し、探す手間を減らす設計を検討できます。'};
 const source={paper:'紙の情報を取り込むところから、',phone:'電話メモ・FAXの情報を整理するところから、',sheet:'今のExcelデータを活かして、',software:'既存ソフトとの連携可否を確かめながら、',mixed:'散らばった情報をつなげて、'}[answers.method];
 const start={daily:'まずは1日分の作業から試せます。',weekly:'まずは1回分の作業から試せます。',monthly:'まずは直近1回分の資料から試せます。',seasonal:'まずは繁忙期の代表的な作業から試せます。'}[answers.frequency]||'';
 const task=label('task',answers.task);
 return {...base,benefit:`「${task}」の負担を減らす専用システムをご提案します。${source||''}${outcomes[answers.pain]||''}`,check:base.check+' '+start};
}
$('consult-open').addEventListener('click',()=>{chime();$('consult-panel').classList.remove('hidden');$('consult-panel').scrollIntoView({behavior:'smooth'});$('company').focus({preventScroll:true});});
