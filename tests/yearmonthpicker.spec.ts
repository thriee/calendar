import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import YearMonthPicker from '@/components/YearMonthPicker.vue';

function pickerMount() {
  return mount(YearMonthPicker, { props: { year: 2026, month: 9 } });
}

describe('YearMonthPicker', () => {
  it('默认展示年份网格（含当前年份所在十年）', () => {
    const wrapper = pickerMount();
    expect(wrapper.find('.ym-picker__years').exists()).toBe(true);
    expect(wrapper.text()).toContain('2020 - 2029');
    expect(wrapper.find('.ym-picker__months').exists()).toBe(false);
  });

  it('十年级导航可前后翻页', async () => {
    const wrapper = pickerMount();
    const navs = wrapper.findAll('.ym-picker__nav');
    // navs[0] = 上十年, navs[1] = 下十年
    await navs[1].trigger('click');
    expect(wrapper.text()).toContain('2030 - 2039');
    await navs[0].trigger('click');
    await navs[0].trigger('click');
    expect(wrapper.text()).toContain('2010 - 2019');
  });

  it('点击年份进入月份视图，点击月份后 emit select(year, month)', async () => {
    const wrapper = pickerMount();
    const yearBtn = wrapper
      .findAll('.ym-picker__cell--year')
      .find((b) => b.text() === '2024');
    expect(yearBtn).toBeTruthy();
    await yearBtn!.trigger('click');

    expect(wrapper.find('.ym-picker__months').exists()).toBe(true);
    expect(wrapper.text()).toContain('2024年');

    const monthBtn = wrapper
      .findAll('.ym-picker__cell--month')
      .find((b) => b.text() === '10月');
    expect(monthBtn).toBeTruthy();
    await monthBtn!.trigger('click');

    const emits = wrapper.emitted('select');
    expect(emits).toBeTruthy();
    expect(emits![0]).toEqual([2024, 10]);
  });

  it('月份视图顶部返回按钮可回到年份视图', async () => {
    const wrapper = pickerMount();
    await wrapper
      .findAll('.ym-picker__cell--year')
      .find((b) => b.text() === '2026')!
      .trigger('click');
    expect(wrapper.find('.ym-picker__months').exists()).toBe(true);

    await wrapper.find('.ym-picker__title--btn').trigger('click');
    expect(wrapper.find('.ym-picker__years').exists()).toBe(true);
  });
});
