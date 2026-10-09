-- Draft content for the Terms & Conditions and Legal Notice pages, read by
-- getPage() like the privacy policy. Replace every [bracketed] placeholder and
-- have the text reviewed before relying on it. Edit later in the `pages` table;
-- translations go in `page_translations`.
-- Only inserts when the slug doesn't exist yet, so it never overwrites edits.

insert into public.pages (id, slug, title, content, created_at, updated_at)
select gen_random_uuid(), 'terms-conditions', 'Terms & Conditions', $html$
<h2>1. About these terms</h2>
<p>These terms apply to every order placed on this website, which is operated by Methys [full legal name], Daskalogianni 33, 73100 Chania, Greece ("Methys", "we", "us"). By placing an order you accept these terms. Our company details are listed in the <a href="/en/legal-notice">Legal Notice</a>.</p>

<h2>2. Orders</h2>
<p>After you place an order you will receive an email confirming that we have received it. The contract is concluded when we send a second email confirming that your order has shipped. We may decline an order, for example when an item is out of stock or a price was shown incorrectly; if you have already paid, we refund you in full.</p>

<h2>3. Prices and payment</h2>
<p>Prices are shown in euros (EUR) and include VAT. Shipping costs are shown at checkout before you pay. Payments are processed securely by Stripe; we never see or store your full card details.</p>

<h2>4. Delivery</h2>
<p>We ship to the countries available at checkout. Estimated delivery times are shown at checkout and in your shipping confirmation. Risk of loss passes to you when the parcel is delivered to you or to a person you have named.</p>

<h2>5. Right of withdrawal and returns</h2>
<p>If you are a consumer in the EU you may withdraw from your purchase within 14 days of receiving the goods, without giving a reason. To do so, contact us at <a href="mailto:support@methys.com">support@methys.com</a> and return the items within 14 days of telling us.</p>
<ul>
  <li>Items must be unworn, unwashed and returned with their original tags.</li>
  <li>We refund the price of the items and the standard delivery cost within 14 days of receiving them back, using your original payment method.</li>
  <li>[State who pays the cost of returning the items.]</li>
</ul>

<h2>6. Faulty items</h2>
<p>You have the statutory legal guarantee for goods that are faulty or not as described. If an item arrives damaged or develops a defect, contact us and we will repair, replace or refund it as the law provides.</p>

<h2>7. Discount codes</h2>
<p>Discount codes, including the newsletter welcome code, are valid once per customer, cannot be exchanged for cash and cannot be combined unless stated otherwise.</p>

<h2>8. Liability</h2>
<p>Nothing in these terms limits our liability where the law does not allow it, including for death or personal injury caused by negligence, or for fraud.</p>

<h2>9. Governing law and disputes</h2>
<p>These terms are governed by the laws of Greece. This does not take away the protection you have under the mandatory consumer laws of the country where you live. If we cannot resolve a complaint together, you can contact the Hellenic Consumer Ombudsman (<a href="https://www.synigoroskatanaloti.gr" rel="noopener noreferrer" target="_blank">synigoroskatanaloti.gr</a>) or the competent consumer body in your country.</p>

<h2>10. Contact</h2>
<p>Questions about these terms? Email <a href="mailto:support@methys.com">support@methys.com</a> or use our <a href="/en/customer-support">support form</a>.</p>
$html$, now(), now()
where not exists (select 1 from public.pages where slug = 'terms-conditions');

insert into public.pages (id, slug, title, content, created_at, updated_at)
select gen_random_uuid(), 'legal-notice', 'Legal Notice', $html$
<h2>Website operator</h2>
<p>
  <strong>Methys</strong> [full legal name, if different]<br>
  Daskalogianni 33<br>
  73100 Chania, Crete<br>
  Greece
</p>

<h2>Contact</h2>
<p>
  Email: <a href="mailto:support@methys.com">support@methys.com</a><br>
  Phone: [phone number]
</p>

<h2>Company registration</h2>
<p>
  Registered with: General Commercial Registry (G.E.MI.)<br>
  G.E.MI. number: [number]<br>
  VAT number: EL[VAT ID]
</p>

<h2>Responsible for content</h2>
<p>[Full name], address as above.</p>

<h2>Consumer disputes</h2>
<p>If we cannot resolve a complaint together, you can contact the Hellenic Consumer Ombudsman (<a href="https://www.synigoroskatanaloti.gr" rel="noopener noreferrer" target="_blank">synigoroskatanaloti.gr</a>) or the competent consumer body in your country.</p>

<h2>Copyright</h2>
<p>All content on this website, including text, photos and logos, belongs to Methys or its licensors and may not be copied or reused without permission.</p>
$html$, now(), now()
where not exists (select 1 from public.pages where slug = 'legal-notice');
