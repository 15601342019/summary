let numStr1 = "9007199254740991";
let numStr2 = "1234567899999999999";

const getTwoBigNumSum = (numStr1,numStr2)=>{
   //取两个数字的最大长度
   let maxLength = Math.max(numStr1.length, numStr2.length);
   //用0去补齐长度
   numStr1 = numStr1.padStart(maxLength , 0);//"0009007199254740991"
   numStr2 = numStr2.padStart(maxLength , 0);//"1234567899999999999"
   //定义加法过程中需要用到的变量
   let total = 0;   //每个index位，数相加的和
   let carry = 0;   //"进位"
   let sum = "";
   for(let i=maxLength-1 ; i>=0 ; i--){
    total = parseInt(a[i]) + parseInt(b[i]) + carry;
    carry = Math.floor(t/10);
    sum = t%10 + sum;
   }
   if(carry == 1){
      sum = "1" + sum;
   }
   return sum;
}

add(a ,b); //结果为：1243575099254740990