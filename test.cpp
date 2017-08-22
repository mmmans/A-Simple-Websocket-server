#include <iostream>
#include <streambuf>
#include <fstream>
#include <string>
#include <stdio.h>
using namespace std;
class test : public streambuf{
	public:
		test():streambuf(){}
};
int main(){
	test buf;
	char cha[10000] = {'1','2'}; 
	string hh;
	istream in(&buf);
	cout<<"test";
	ostream tt(in.rdbuf());
	cout<<"test2";
	tt.write(cha,10000);
	//cout<<"test3";
	//cin>>hh;
	cout<<"dfd"<<endl;
	istream ins(&buf);
	ins>>hh;
	//cout<<cin.rdbuf();
	cout<<hh<<endl;
	
	//ostream<<"wearehere";
	//ostream<<"ddd";
	//istream test1(&buf);
	//cout<<test1;
	//ofstream 
	return 0;
}