(() => {
  'use strict';
  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const fields = document.querySelector('#form-fields');
  const review = document.querySelector('#form-review');
  const summary = document.querySelector('#form-review-details');
  const status = document.querySelector('#form-status');
  const firstButton = document.querySelector('#form-review-button');
  const sendButton = document.querySelector('#form-send-button');
  const backButton = document.querySelector('#form-back-button');
  const type = document.querySelector('#contact-type');
  if (new URLSearchParams(location.search).get('type') === 'recruit') type.value = '採用について';
  firstButton.textContent = '入力内容を確認する';
  let reviewing = false;
  let sending = false;
  const labels = [['name','お名前'],['email','メールアドレス'],['phone','電話番号'],['inquiry_type','お問い合わせの種類'],['room','ご希望の園'],['message','お問い合わせ内容']];
  function edit() {
    reviewing = false;
    fields.hidden = false;
    review.hidden = true;
    status.textContent = '';
    firstButton.focus();
  }
  backButton.addEventListener('click',edit);
  form.addEventListener('submit',event => {
    if (sending) { event.preventDefault(); return; }
    if (!reviewing) {
      event.preventDefault();
      for (const name of ['name','email','message']) {
        const field = form.elements.namedItem(name);
        field.value = field.value.trim();
      }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      summary.replaceChildren();
      for (const [key,label] of labels) {
        const row=document.createElement('div'),term=document.createElement('dt'),value=document.createElement('dd');
        term.textContent=label; value.textContent=String(data.get(key)||'未入力');
        row.append(term,value); summary.append(row);
      }
      fields.hidden=true; review.hidden=false; reviewing=true;
      document.querySelector('#form-review-title').focus();
      return;
    }
    // A native POST preserves the provider's CAPTCHA and error/activation screens.
    // Do not show delivery success here: only the receiving service can accept a submission.
    sending=true;
    sendButton.disabled=true; backButton.disabled=true;
    status.textContent='送信サービスへ接続しています。次の画面の案内をご確認ください。';
  });
  window.addEventListener('pageshow',()=>{
    sending=false; sendButton.disabled=false; backButton.disabled=false;
    if (reviewing) edit();
  });
})();
