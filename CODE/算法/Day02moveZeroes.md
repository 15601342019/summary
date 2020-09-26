
### 移动零 leetcode 283
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

示例:

输入: [0,1,0,3,12]
输出: [1,3,12,0,0]
说明:

必须在原数组上操作，不能拷贝额外的数组。
尽量减少操作次数。

```js
/**
 * js方法
 * for in 获取的key为string类型。。。
 * 发现for循环的效率比for in高了10毫秒
 * 解题思路
 * 
 * 用一个变量记录 非零数字所在的实际索引 nozeroidx
 * 然后当item非0时，nums[nozeroidx] = nums[key]。记录下 一条非零数据，nozeroidx需要+1，否则不需要
 * 同时当nozeroidx不等于当前key的时候，需要将当前item置为0，
 */
var moveZeroes = function(nums) {
    let nozeroidx = 0;
    for (let key=0;key<nums.length; key++) {
        if(nums[key] !== 0){
            nums[nozeroidx] = nums[key];
            if(nozeroidx !== (key-0)) {
                nums[key] = 0;
            }
            nozeroidx++;
        }
    }
};
```

